using System;
using CineNiche.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────
// Configure Services
// ─────────────────────────────────────────────

builder.Services.AddControllers();

// 🔥 Dynamically resolve DB path for local + Azure
var dbPath = Path.Combine(AppContext.BaseDirectory, "RecommendationEngine", "Movies.sqlite");
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

// Swagger for API docs
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ CORS for local + deployed frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .WithOrigins("http://localhost:5173", "https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net")
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Optional external Flask recommender
builder.Services.AddHttpClient();
builder.Services.AddHttpClient("Flask", client =>
{
    client.BaseAddress = new Uri("http://localhost:5000/");
});

var app = builder.Build();

// ─────────────────────────────────────────────
// Configure Middleware
// ─────────────────────────────────────────────

app.UseDeveloperExceptionPage(); // 👈 helpful for debugging in production

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
