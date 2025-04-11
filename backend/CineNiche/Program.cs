using CineNiche.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ✅ Use real DB (SQLite replaced with SQL Server or another real DB in production)
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))); // ✅ switch to real DB later

// ✅ Configure ASP.NET Identity with better password rules
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 12; // ✅ stronger than default
    options.Password.RequiredUniqueChars = 1;
})
.AddEntityFrameworkStores<MovieDbContext>()
.AddDefaultTokenProviders();

// ✅ Cookie setup with Secure & HttpOnly
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true; // ✅ Cookie security
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // ✅ HTTPS only
    options.Cookie.SameSite = SameSiteMode.None;
    options.LoginPath = "/login";
    options.SlidingExpiration = true;
    options.Cookie.Name = "AspNetCore.Identity.Application";
});

// ✅ CORS (Cross-Origin Resource Sharing) for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder => builder
        .WithOrigins(
            "http://localhost:5173",
            "https://proud-bush-0e160501e.6.azurestaticapps.net")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()); // ✅ supports secure cookie auth
});

// ✅ Swagger (optional during dev)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Enable HSTS (HTTP Strict Transport Security) Extra Security Measure
builder.Services.AddHsts(options =>
{
    options.MaxAge = TimeSpan.FromDays(365); // Tell browsers to always use HTTPS for 1 year
    options.IncludeSubDomains = true;        // Apply the rule to all subdomains too (e.g., admin.site.com)
    options.Preload = true;                  // Ask browsers to preload our domain as HTTPS-only (requires manual submission)
});


builder.Services.AddControllers();

var app = builder.Build();

// ✅ Dev vs Prod Middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection(); // ✅ Redirect HTTP to HTTPS
    app.UseHsts();             // ✅ Enforce HTTPS with HSTS
}

// ✅ Allow frontend access before auth
app.UseCors("AllowFrontend");

// ✅ Content Security Policy (CSP)
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

// ✅ Authentication & Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// ✅ Logout route
app.MapPost("/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(IdentityConstants.ApplicationScheme);
    return Results.Ok(new { message = "Logged out successfully." });
});

// ✅ /pingauth for auth status check (anonymous)
app.MapGet("/pingauth", (HttpContext context) =>
{
    if (context.User?.Identity?.IsAuthenticated != true)
        return Results.Unauthorized();

    return Results.Ok(new { email = context.User.Identity.Name });
});

// ✅ Controllers (should use [Authorize] where appropriate)
app.MapControllers();

// ✅ Seed roles (Admin, Customer) — RBAC support
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

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = services.GetRequiredService<UserManager<IdentityUser>>();

    string[] roles = { "Admin", "Customer" };
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    // ✅ Create admin user (only if not already exists)
    var adminEmail = "admin@cineniche.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser == null)
    {
        var newAdmin = new IdentityUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
        var result = await userManager.CreateAsync(newAdmin, "AdminPassword123!"); // 👈 make sure this meets your password rules

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(newAdmin, "Admin");
        }
    }
}

// Second Additional Security Measure: Google Authentication 

//builder.Services.AddAuthentication()
//    .AddGoogle(googleOptions =>
//    {
//        googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
//        googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
//    });

// ✅ Launch app
app.Run();
