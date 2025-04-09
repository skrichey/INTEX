using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminTestController : ControllerBase
    {
        [HttpGet("secret")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetSecret()
        {
            return Ok(new { message = "Welcome, Admin! 🎉" });
        }
    }
}
