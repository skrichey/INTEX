using CineNiche.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DB Context Setup
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity Setup
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
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

//builder.Services.AddAuthentication()
//    .AddGoogle(googleOptions =>
//    {
//        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
//        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
//    });

// Cookie Configuration
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None;
    options.LoginPath = "/login";
    options.SlidingExpiration = true;
    options.Cookie.Name = "AspNetCore.Identity.Application";
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
        .AllowCredentials());
});

// Swagger Setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// HSTS Config (for non-dev)
builder.Services.AddHsts(options =>
{
    options.MaxAge = TimeSpan.FromDays(365);
    options.IncludeSubDomains = true;
    options.Preload = true;
});

builder.Services.AddControllers();

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

// ✅ CORS before auth
app.UseCors("AllowFrontend");

// CSP Header
app.Use(async (context, next) =>
{
    context.Response.Headers["Content-Security-Policy"] = string.Join(" ",
        "default-src 'self';",
        "style-src 'self' 'unsafe-inline';",
        "font-src 'self';",
        "img-src 'self';",
        "script-src 'self';",
        "connect-src 'self';");
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

// Auth endpoints
app.MapPost("/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(IdentityConstants.ApplicationScheme);
    return Results.Ok(new { message = "Logged out successfully." });
});

app.MapGet("/pingauth", (HttpContext context) =>
{
    if (context.User?.Identity?.IsAuthenticated != true)
        return Results.Unauthorized();

    return Results.Ok(new { email = context.User.Identity.Name });
});

app.MapControllers();

// Role seeding (optional, safe to leave in)
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

