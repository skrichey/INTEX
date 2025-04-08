using Microsoft.AspNetCore.Mvc;
using CineNiche.Data;
using CineNiche.Models;
using System;

namespace CineNiche.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingsController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public RatingsController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitRating([FromBody] Rating rating)
        {
            var response = await _httpClient.PostAsJsonAsync("http://localhost:5000/ratings", rating);

            if (!response.IsSuccessStatusCode)
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"ML API Error: {errorBody}"); // Log it
                return StatusCode(500, $"Failed to submit rating to ML API: {errorBody}");
            }

            return Ok();
        }
    }
}
