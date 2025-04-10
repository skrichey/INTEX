using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(
            SignInManager<IdentityUser> signInManager,
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var email = request.Email.ToLowerInvariant();

                var userExists = await _userManager.FindByEmailAsync(email);
                if (userExists != null)
                    return BadRequest(new { message = "User already exists." });

                var user = new IdentityUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true // ✅ allow login immediately
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    var errorMessages = result.Errors.Select(e => e.Description);
                    return BadRequest(new
                    {
                        message = "User creation failed.",
                        errors = errorMessages
                    });
                }

                if (!await _roleManager.RoleExistsAsync("User"))
                    await _roleManager.CreateAsync(new IdentityRole("User"));

                await _userManager.AddToRoleAsync(user, "User");

                return Ok(new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Register ERROR] {ex.Message}");
                Console.WriteLine(ex.StackTrace);

                return StatusCode(500, new
                {
                    message = "Unexpected error occurred during registration.",
                    error = ex.Message,
                    stack = ex.StackTrace
                });
            }
        }

[HttpPost("login")]
[AllowAnonymous]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var normalizedEmail = request.Email.Trim().ToUpperInvariant();

    var user = await _userManager.Users
        .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);

    if (user == null)
    {
        Console.WriteLine($"[Login] User not found: {normalizedEmail}");
        return Unauthorized(new { message = "Invalid credentials." });
    }

    var result = await _signInManager.PasswordSignInAsync(user, request.Password, isPersistent: true, lockoutOnFailure: false);

    if (!result.Succeeded)
    {
        Console.WriteLine($"[Login Failed] User: {user.Email}, Reason: " +
            $"{(result.IsLockedOut ? "Locked out" : "")} " +
            $"{(result.IsNotAllowed ? "Not allowed" : "")} " +
            $"{(!result.Succeeded ? "Invalid credentials" : "")}");

        return Unauthorized(new { message = "Invalid credentials." });
    }

    var roles = await _userManager.GetRolesAsync(user);
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Email),
        new Claim(ClaimTypes.Role, roles.Contains("Admin") ? "Admin" : "User")
    };

    var identity = new ClaimsIdentity(claims, IdentityConstants.ApplicationScheme);
    await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, new ClaimsPrincipal(identity));

    return Ok(new { message = "Login successful!" });
}



        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return Ok(new { message = "Logged out successfully." });
        }

        [HttpGet("pingauth")]
        public IActionResult PingAuth()
        {
            if (!User.Identity.IsAuthenticated)
                return Unauthorized();

            return Ok(new { email = User.Identity.Name });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
