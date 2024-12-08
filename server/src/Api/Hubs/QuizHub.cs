using Microsoft.AspNetCore.SignalR;
namespace Api.Hubs
{
    public class QuizHub(ServiceState state) : Hub
    {
        public async Task<Session> CreateSession(string username)
        {
            var session = new Session("Quiz");
            state.sessions.Add(session);
            await JoinSession(session.Id, username);
            return session;
        }

        public Session GetSession(string sessionId)
        {
            var session = state.sessions.SingleOrDefault(x => x.Id == sessionId);
            if (session == null)
                throw new HubException($"Session not found with id {sessionId}");

            return session;
        }

        public async Task<Session> JoinSession(string sessionId, string username)
        {
            var session = state.sessions.SingleOrDefault(x => x.Id == sessionId);
            if (session == null)
                throw new HubException($"Session not found with id {sessionId}");

            var existingConnection = state.playerConnections.SingleOrDefault(x => x.SessionId == sessionId && x.ConnectionId == Context.ConnectionId);
            if (existingConnection != null)
                throw new HubException($"You are already a part of the session {sessionId}");

            var player = new Player
            {
                Id = new Random().Next(1, 1000),
                Username = username,
            };
            session.AddPlayer(player);
            state.playerConnections.Add(new PlayerConnection
            {
                ConnectionId = Context.ConnectionId,
                SessionId = session.Id,
                Player = player
            });

            await Clients.All.SendAsync("PlayerJoined", player);
            return session;
        }

        public async Task LeaveSession(string sessionId)
        {
            var connection = state.playerConnections.SingleOrDefault(x => x.ConnectionId == Context.ConnectionId && x.SessionId == sessionId);
            if (connection == null)
                throw new HubException($"You are not in a session with id {sessionId}");

            var session = state.sessions.Single(x => x.Id == sessionId);
            session.RemovePlayer(connection.Player);
            state.playerConnections.Remove(connection);

            await Clients.All.SendAsync("PlayerLeft", connection.Player);
        }


        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task Celebrate(string user)
        {
            await Clients.All.SendAsync("ReceiveCelebration", user, 5);
        }
    }

    public class Session
    {
        public string Id { get; set; } = null!;
        public string Type { get; set; } = null!;
        public Player? Owner { get; set; } = null!;
        public List<Player> Players { get; set; } = [];

        public Session(string type)
        {
            Id = "550-321"; // GenerateSessionId();
            Type = type;
        }

        public void AddPlayer(Player player)
        {
            Owner ??= player;
            Players.Add(player);
        }

        public void RemovePlayer(Player player)
        {
            if (Owner == player)
                Owner = null;

            Players.Remove(player);
        }

        private string GenerateSessionId()
        {
            var random = new Random().Next(1, 1000000).ToString();
            return random.Insert(3, "-");
        }
    }

    public class PlayerConnection
    {
        public string ConnectionId { get; set; } = null!;
        public string SessionId { get; set; } = null!;
        public Player Player { get; set; } = null!;
    }

    public class Player
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
    }
}