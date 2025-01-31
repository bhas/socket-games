using Api.Games;
using Api.Hubs;

namespace Api;

public class ServiceState
{
    public readonly List<User> users = [];
    public readonly List<Session> sessions = [];
    public readonly List<RockPaperScissorsGame> rockPaperScissorsGames = [];
}
