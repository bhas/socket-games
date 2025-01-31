using Microsoft.AspNetCore.SignalR;
namespace Api.Hubs
{
    public class QuizHub(ServiceState state) : Hub
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
    }

    public class Session
    {
        public string Id { get; set; } = null!;
        public string Type { get; set; } = null!;
        public User? Owner { get; set; } = null!;
        public List<User> Players { get; set; } = [];

        public Session(string type)
        {
            Id = GenerateSessionId();
            Type = type;
        }

        public void AddPlayer(User player)
        {
            Owner ??= player;
            Players.Add(player);
        }

        public void RemovePlayer(User player)
        {
            if (Owner == player)
                Owner = null;

            Players.Remove(player);
        }

        private string GenerateSessionId()
        {
            var r1 = new Random().Next(1, 1000);
            var r2 = new Random().Next(1, 1000);
            return $"{r1:D3}-{r2:D3}";
        }
    }

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;

        public static User Create(string username)
        {
            return new User()
            {
                Id = new Random().Next(1, 1000),
                Username = username
            };
        }
    }
}