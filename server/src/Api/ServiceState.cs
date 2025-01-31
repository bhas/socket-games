using Api.Hubs;

namespace Api;

public class ServiceState
{
    public readonly List<User> users = new();
    public readonly List<Session> sessions = [];
}
