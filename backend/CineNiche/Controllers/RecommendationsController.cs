using Microsoft.AspNetCore.Mvc;
using CineNiche.Data;
using CineNiche.Models;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;

namespace CineNiche.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationsController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly MovieDbContext _context;

        public RecommendationsController(HttpClient httpClient, MovieDbContext context)
        {
            _httpClient = httpClient;
            _context = context;
        }

        public class MovieRecommendationRequest
        {
            public string show_id { get; set; }
        }

        public class RecommendationRequest
        {
            public string user_id { get; set; }
        }

        // Hybrid: Cold-start or standard recommend
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetRecommendations(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest("Invalid user_id.");
            }

            bool hasRatings = await _context.movies_ratings.AnyAsync(r => r.user_id == userId);

            var apiEndpoint = hasRatings ? "/recommend" : "/cold_start_recommend";

            object payload = hasRatings
                ? new { user_id = userId }
                : new { user_id = userId, is_new_user = true };

            var response = await _httpClient.PostAsJsonAsync($"http://localhost:5000{apiEndpoint}", payload);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode(500, $"Failed to fetch recommendations from ML API: {error}");
            }

            var recommendations = await response.Content.ReadFromJsonAsync<List<RecommendationDto>>();
            return Ok(recommendations);
        }


        // Recommend by movie ID
        [HttpPost("by-movie")]
        public async Task<IActionResult> GetRecommendationsByMovie([FromBody] MovieRecommendationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.show_id))
            {
                return BadRequest("Missing show_id.");
            }

            var response = await _httpClient.PostAsJsonAsync("http://localhost:5000/recommend_by_movie", request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode(500, $"Failed to fetch recommendations: {error}");
            }

            var recommendations = await response.Content.ReadFromJsonAsync<List<RecommendationDto>>();
            return Ok(recommendations);
        }

        // Top-rated movies
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedMovies()
        {
            var response = await _httpClient.GetAsync("http://localhost:5000/top_rated");

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode(500, $"Failed to fetch top rated movies: {error}");
            }

            var topRated = await response.Content.ReadFromJsonAsync<List<RecommendationDto>>();
            return Ok(topRated);
        }
    }
}
