public class Session
{
    public string Id { get; set; } = null!;
    public string Type { get; set; } = null!;
    public User? Owner { get; set; } = null!;
    public List<User> Players { get; set; } = [];
    public bool IsLocked { get; set; }
    public GameType? CurrentGameType { get; set; }
    public int? CurrentGameId { get; set; }

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

public enum GameType
{
    RockPaperScissors
}