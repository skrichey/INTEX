using Microsoft.AspNetCore.Mvc;
using CineNiche.Data;
using CineNiche.Models;
using Microsoft.EntityFrameworkCore;

namespace CineNiche.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MovieDbContext _context;

        public UsersController(MovieDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.AspNetUsers.ToListAsync();
            return Ok(users);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] ApplicationUser user)
        {
            if (string.IsNullOrWhiteSpace(user.Name))
                return BadRequest("Name is required.");

            if (await _context.AspNetUsers.AnyAsync(u => u.Id == user.Id))
                return Conflict("User with this ID already exists.");

            _context.AspNetUsers.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User created successfully", user.Id });
        }

        // DELETE: api/Users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.AspNetUsers.FindAsync(id);
            if (user == null)
                return NotFound("User not found.");

            // Optionally delete user ratings as well
            var ratings = _context.AspNetMoviesRatings.Where(r => r.user_id == user.Id);
            _context.AspNetMoviesRatings.RemoveRange(ratings);

            _context.AspNetUsers.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }
    }
}

