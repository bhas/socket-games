using Api.Hubs;
using Microsoft.AspNetCore.SignalR;
using System.Numerics;
namespace Api.Games;

public interface IRockPaperScissorsService
{
    RockPaperScissorsGame GetGame(int gameId);
    Task SelectMove(int gameId, int userId, RockPaperScissorsGame.Move move);
    Task StartGame(Session session);
    Task StopGame(Session session);
}

public class RockPaperScissorsService(IHubContext<QuizHub> hubContext, ServiceState state) : IRockPaperScissorsService
{
    public RockPaperScissorsGame GetGame(int gameId)
    {
        var game = state.rockPaperScissorsGames.Single(x => x.Id == gameId);
        return game;
    }

    public async Task StartGame(Session session)
    {
        if (session.Players.Count != 2)
            throw new HubException($"Game can only start with 2 players");

        var game = new RockPaperScissorsGame()
        {
            Id = new Random().Next(1, 1000),
            Player1 = session.Players[0],
            Player2 = session.Players[1]
        };
        session.CurrentGameType = GameType.RockPaperScissors;
        session.CurrentGameId = game.Id;
        session.IsLocked = true;

        state.rockPaperScissorsGames.Add(game);

        await hubContext.Clients.All.SendAsync("GameStarted", game);
    }

    public async Task StopGame(Session session)
    {
        var game = state.rockPaperScissorsGames.Single(x => x.Id == session.CurrentGameId);
        state.rockPaperScissorsGames.Remove(game);
        session.CurrentGameId = null;
        session.CurrentGameType = null;
        session.IsLocked = false;
        await hubContext.Clients.All.SendAsync("GameStopped", game.Id);
    }

    public async Task SelectMove(int gameId, int userId, RockPaperScissorsGame.Move move)
    {
        var game = state.rockPaperScissorsGames.Single(x => x.Id == gameId);
        game.SelectMove(userId, move);
        if (game.CurrentRound.Player1Move != null && game.CurrentRound.Player2Move != null)
        {
            game.NextRound();

            if (game.Leaderboard.Player1Wins >= game.ScoreToWin)
                game.Leaderboard.Winner = game.Player1;

            if (game.Leaderboard.Player2Wins >= game.ScoreToWin)
                game.Leaderboard.Winner = game.Player2;

            if (game.Leaderboard.Winner != null)
                await hubContext.Clients.All.SendAsync("GameCompleted", game);
            else
                await hubContext.Clients.All.SendAsync("RoundCompleted", game);
        }
    }
}
