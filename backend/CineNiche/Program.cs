using System;
using CineNiche.Data;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
// ─────────────────────────────────────────────
// Configure Services
// ─────────────────────────────────────────────
// Add controllers
builder.Services.AddControllers();
// Register DbContext using SQLite
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
// Add Swagger for API documentation/testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Allow CORS for your React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddHttpClient();

builder.Services.AddHttpClient("Flask", client =>
{
    client.BaseAddress = new Uri("http://localhost:5000/");
});
var app = builder.Build();
// ─────────────────────────────────────────────
// Configure Middleware
// ─────────────────────────────────────────────
// Redirect HTTP to HTTPS
app.UseHttpsRedirection();
// Enable Swagger in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
// Enable CORS (must be between UseRouting and UseEndpoints)
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();
app.UseHttpsRedirection();
app.Run();
