using System;
using CineNiche.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ─────────────────────────────────────────────
// Configure Services
// ─────────────────────────────────────────────

builder.Services.AddControllers();

// Register DbContext using SQLite
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();         // 🔐 Force HTTPS early
app.UseCors("AllowFrontend");      // ✅ Allow frontend requests before routing
app.UseAuthorization();            // 🔐 Handle auth (if added later)
app.MapControllers();              // 🎯 Route API calls

app.Run();
