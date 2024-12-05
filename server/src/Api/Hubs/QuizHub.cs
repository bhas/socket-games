using System;
using System.Web;
using Microsoft.AspNetCore.SignalR;
namespace SignalRChat
{
    public class QuizHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task Celebrate(string user)
        {
            await Clients.All.SendAsync("ReceiveCelebration", user, 5);
        }
    }
}