using CineNiche.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// DB Context Setup
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity Setup
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 12;
    options.Password.RequiredUniqueChars = 1;
})
.AddEntityFrameworkStores<MovieDbContext>()
.AddDefaultTokenProviders();

// Cookie Auth Configuration
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None; // 🔥 Required for cross-site requests
    options.Cookie.Name = "AspNetCore.Identity.Application";
    options.SlidingExpiration = true;

    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };

    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder => builder
        .WithOrigins(
            "http://localhost:5173",
            "https://proud-bush-0e160501e.6.azurestaticapps.net")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()); // 🔥 Must allow credentials
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHsts(options =>
{
    options.MaxAge = TimeSpan.FromDays(365);
    options.IncludeSubDomains = true;
    options.Preload = true;
});

var app = builder.Build();

// Development-only middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
    app.UseHsts();
}

// 🚨 Order matters: CORS BEFORE auth
app.UseCors("AllowFrontend");

// 🔧 NEW: Fix SameSite cookie issues across domains
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.None,
    Secure = CookieSecurePolicy.Always
});

// Optional CSP Header
//app.Use(async (context, next) =>
//{
//    context.Response.Headers["Content-Security-Policy"] = string.Join(" ",
//        "default-src 'self';",
//        "style-src 'self' 'unsafe-inline';",
//        "font-src 'self';",
//        "img-src 'self';",
//        "script-src 'self';",
//        "connect-src 'self' https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net;");
//    await next();
//});

app.UseAuthentication();
app.UseAuthorization();

// --- AUTH ENDPOINTS ---

// Logout
app.MapPost("/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(IdentityConstants.ApplicationScheme);
    return Results.Ok(new { message = "Logged out successfully." });
});

// Basic ping route
app.MapGet("/pingauth", (HttpContext context) =>
{
    if (context.User?.Identity?.IsAuthenticated != true)
        return Results.Unauthorized();

    return Results.Ok(new { email = context.User.Identity.Name });
});

// ✅ Root path response to avoid Azure 404
app.MapGet("/", () => Results.Ok("CineNiche API is running."));

app.MapControllers();

// Role seeding
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    string[] roles = { "Admin", "Customer" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}

app.Run();
