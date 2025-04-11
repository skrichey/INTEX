using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using CineNiche.Data;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AuthController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
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

                // ✅ Guard clause
                if (request.Preferences == null || request.Preferences.Count != 8)
                    return BadRequest(new { message = "Preferences array must have exactly 8 values (0 or 1)." });

                if (request.Preferences.Any(p => p != 0 && p != 1))
                    return BadRequest(new { message = "Each preference value must be either 0 or 1." });

                var user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,

                    Name = request.Name,
                    Age = request.Age,
                    Gender = request.Gender,
                    City = request.City,
                    State = request.State,
                    Zip = request.Zip,

                    Netflix = request.Preferences[0] == 1,
                    Amazon_Prime = request.Preferences[1] == 1,
                    DisneyPlus = request.Preferences[2] == 1,
                    ParamountPlus = request.Preferences[3] == 1,
                    Max = request.Preferences[4] == 1,
                    Hulu = request.Preferences[5] == 1,
                    AppleTVPlus = request.Preferences[6] == 1,
                    Peacock = request.Preferences[7] == 1
                };


                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    var errorMessages = result.Errors.Select(e => e.Description).ToList();

                    Console.WriteLine("[Register ERROR] Identity creation failed.");
                    foreach (var error in errorMessages)
                    {
                        Console.WriteLine($" - {error}");
                    }

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
            Console.WriteLine($"PasswordSignIn Result: Succeeded={result.Succeeded}, IsLockedOut={result.IsLockedOut}, IsNotAllowed={result.IsNotAllowed}, RequiresTwoFactor={result.RequiresTwoFactor}");


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
        new Claim(ClaimTypes.NameIdentifier, user.Id), // 🔐 this makes /api/auth/user work
        new Claim(ClaimTypes.Name, user.Email),
        new Claim(ClaimTypes.Role, roles.Contains("Admin") ? "Admin" : "User")
    };


            var identity = new ClaimsIdentity(claims, IdentityConstants.ApplicationScheme);
            await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, new ClaimsPrincipal(identity));

            return Ok(new { message = "Login successful!" });
        }

        [HttpOptions("login")]
        [AllowAnonymous]
        public IActionResult OptionsLogin()
        {
            return Ok();
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

        [Authorize]
        [HttpGet("user")]
        public IActionResult GetCurrentUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(userId);
        }
    }


    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    
}
