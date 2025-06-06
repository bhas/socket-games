using Api;
using Api.Games;
using Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

builder.Services.AddSingleton(new ServiceState());
builder.Services.AddTransient<IRockPaperScissorsService, RockPaperScissorsService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", builder =>
    {
        builder.WithOrigins("http://localhost:5173", "https://fabulab-ui.bvinther.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
    app.UseSwagger();
    app.UseSwaggerUI();
if (app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseCors("AllowLocalhost");
app.UseHttpsRedirection();
//app.UseStaticFiles();
//app.UseRouting();
app.MapHub<QuizHub>("quiz");

app.MapGet("/dummy", () => "This is a dummy endpoint");

app.Run();
