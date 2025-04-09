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
            var users = await _context.movies_users.ToListAsync();
            return Ok(users);
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (string.IsNullOrWhiteSpace(user.name))
                return BadRequest("Name is required.");

            if (await _context.movies_users.AnyAsync(u => u.user_id == user.user_id))
                return Conflict("User with this ID already exists.");

            _context.movies_users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User created successfully", user.user_id });
        }

        // DELETE: api/Users/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.movies_users.FindAsync(id);
            if (user == null)
                return NotFound("User not found.");

            // Optionally delete user ratings as well
            var ratings = _context.movies_ratings.Where(r => r.user_id == id);
            _context.movies_ratings.RemoveRange(ratings);

            _context.movies_users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }
    }
}

