using Api.Hubs;

namespace Api;

public class ServiceState
{
    public readonly List<PlayerConnection> playerConnections = [];
    public readonly List<Session> sessions = [];
}
