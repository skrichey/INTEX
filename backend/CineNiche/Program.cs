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

builder.Services.AddAuthentication()
    .AddGoogle(googleOptions =>
    {
        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
    });

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

// Add Controllers
builder.Services.AddControllers();

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder => builder
        .WithOrigins(
            "http://localhost:5173",
            "https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

// Swagger Setup
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Automatically create Identity tables and roles
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MovieDbContext>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

    context.Database.EnsureCreated();

    // Seed roles
    string[] roles = { "Admin", "User" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    // Optional: Seed admin user
    var adminEmail = "admin@cineniche.com";
    var adminPassword = "AdminPassword123!";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser == null)
    {
        var newAdmin = new IdentityUser { UserName = adminEmail, Email = adminEmail };
        var result = await userManager.CreateAsync(newAdmin, adminPassword);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(newAdmin, "Admin");
            Console.WriteLine("✅ Admin user created.");
        }
        else
        {
            Console.WriteLine("❌ Failed to create admin user:");
            foreach (var error in result.Errors)
                Console.WriteLine($"- {error.Description}");
        }
    }
}

// Extra secruity feature Is 414
// HTTPS and HSTS
app.UseHttpsRedirection();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts(hsts =>
    {
        hsts.MaxAge = TimeSpan.FromDays(365); // 1 year
        hsts.IncludeSubDomains = true; // Include subdomains in HSTS policy
    });
}



// Content Security Policy (CSP)
app.Use(async (context, next) =>
{
    context.Response.Headers["Content-Security-Policy"] =
        @"default-src 'self'; 
        style-src 'self' 'unsafe-inline'; 
        font-src 'self'; 
        img-src 'self'; 
        script-src 'self'; 
        connect-src 'self';";

    await next();
});




app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// Custom Auth Endpoints
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

app.Run();
