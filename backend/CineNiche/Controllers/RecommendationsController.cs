using Microsoft.AspNetCore.Mvc;
using CineNiche.Data;
using CineNiche.Models;
using System;
namespace CineNiche.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationsController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public RecommendationsController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public class MovieRecommendationRequest
        {
            public string show_id { get; set; }
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetRecommendations(int userId)
        {
            var response = await _httpClient.PostAsJsonAsync("http://localhost:5000/recommend", new { user_id = userId });

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode(500, "Failed to fetch recommendations from ML API");
            }

            var recommendations = await response.Content.ReadFromJsonAsync<List<RecommendationDto>>();
            return Ok(recommendations);
        }

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