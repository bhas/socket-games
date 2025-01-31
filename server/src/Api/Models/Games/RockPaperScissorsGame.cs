using Api.Hubs;
using Microsoft.AspNetCore.SignalR;
namespace Api.Games;

public class RockPaperScissorsGame()
{
    public required int Id { get; set; }
    public int ScoreToWin => 5;
    public required User Player1 { get; set; }
    public required User Player2 { get; set; }
    public GameLeaderboard Leaderboard { get; set; } = new GameLeaderboard();
    public Round CurrentRound { get; set; } = new Round();

    public void SelectMove(int playerId, Move move)
    {
        if (playerId == Player1.Id)
            CurrentRound.Player1Move = move;
        else if (playerId == Player2.Id)
            CurrentRound.Player2Move = move;
    }

    public void NextRound()
    {
        Leaderboard.Rounds.Add(CurrentRound);
        CurrentRound = new Round();
    }

    public class GameLeaderboard
    {
        public List<Round> Rounds { get; set; } = [];
        public int Player1Wins => Rounds.Count(x => x.Result == RoundResult.Player1Wins);
        public int Player2Wins => Rounds.Count(x => x.Result == RoundResult.Player2Wins);
        public User? Winner { get; set; }
    }

    public class Round
    {
        public Move? Player1Move { get; set; }
        public Move? Player2Move { get; set; }
        public RoundResult? Result
        {
            get
            {
                if (Player1Move == null || Player2Move == null)
                    return null;

                if (Player1Move == Player2Move)
                    return RoundResult.Draw;

                return Player1Move switch
                {
                    Move.Paper when Player2Move == Move.Rock => RoundResult.Player1Wins,
                    Move.Paper when Player2Move == Move.Scissors => RoundResult.Player2Wins,
                    Move.Rock when Player2Move == Move.Paper => RoundResult.Player2Wins,
                    Move.Rock when Player2Move == Move.Scissors => RoundResult.Player1Wins,
                    Move.Scissors when Player2Move == Move.Rock => RoundResult.Player2Wins,
                    Move.Scissors when Player2Move == Move.Paper => RoundResult.Player1Wins,
                    _ => throw new NotImplementedException()
                };
            }
        }
    }

    public enum RoundResult
    {
        Player1Wins,
        Player2Wins,
        Draw
    }

    public enum Move
    {
        Rock,
        Paper,
        Scissors
    }
}


