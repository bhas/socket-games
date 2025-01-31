using Api.Games;
using Microsoft.AspNetCore.SignalR;
namespace Api.Hubs
{
    public class QuizHub(ServiceState state, IRockPaperScissorsService rockPaperScissorsService) : Hub
    {
        public User SignIn(string username)
        {
            var user = User.Create(username);
            state.users.Add(user);
            return user;
        }

        public async Task<Session> CreateSession(int userId)
        {
            var user = state.users.Single(x => x.Id == userId);
            var session = new Session("Quiz");
            state.sessions.Add(session);
            await JoinSession(session.Id, userId);
            return session;
        }

        public Session GetSession(string sessionId)
        {
            var session = state.sessions.SingleOrDefault(x => x.Id == sessionId);
            if (session == null)
                throw new HubException($"Session not found with id {sessionId}");

            return session;
        }

        public async Task<Session> JoinSession(string sessionId, int userId)
        {
            var session = state.sessions.SingleOrDefault(x => x.Id == sessionId);
            if (session == null)
                throw new HubException($"Session not found with id {sessionId}");

            var existingPlayer = session.Players.SingleOrDefault(x => x.Id == userId);
            if (existingPlayer != null)
                throw new HubException($"You are already a part of the session {sessionId}");

            if (session.IsLocked)
                throw new HubException($"You cannot join the session at this moment {sessionId}");

            var user = state.users.Single(x => x.Id == userId);
            session.AddPlayer(user);
            await Clients.All.SendAsync("PlayerJoined", user);
            return session;
        }

        public async Task LeaveSession(string sessionId, int userId)
        {
            var session = state.sessions.Single(x => x.Id == sessionId);
            var player = session.Players.Single(x => x.Id == userId);
            session.RemovePlayer(player);
            await Clients.All.SendAsync("PlayerLeft", player);
        }

        public async Task StartGame(string sessionId, int userId, GameType gameType)
        {
            var session = state.sessions.Single(x => x.Id == sessionId);
            if (session.Owner?.Id != userId)
                throw new HubException($"Only the owner of the session can start the game");

            await rockPaperScissorsService.StartGame(session);
        }

        public RockPaperScissorsGame GetGame(int gameId)
        {
            return rockPaperScissorsService.GetGame(gameId);
        }

        public async Task SelectMove(int gameId, int userId, RockPaperScissorsGame.Move move)
        {
            await rockPaperScissorsService.SelectMove(gameId, userId, move);
        }
    }
}