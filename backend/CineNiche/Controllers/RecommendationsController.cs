using Microsoft.AspNetCore.Mvc;
using CineNiche.Data;
using CineNiche.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Newtonsoft.Json;

namespace CineNiche.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationsController : ControllerBase
    {
        private readonly MovieDbContext _context;
        private readonly IWebHostEnvironment _env;

        public RecommendationsController(MovieDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public class MovieRecommendationRequest
        {
            public string show_id { get; set; }
        }

        private string GetScriptPath() =>
            Path.Combine(_env.ContentRootPath, "RecommendationEngine", "recommend.py");

        private string RunPythonScript(string args)
        {
            var psi = new ProcessStartInfo
            {
                //FileName = "python",
                FileName = @"D:\home\python3111x64\python.exe",
                Arguments = $"{GetScriptPath()} {args}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            var output = process.StandardOutput.ReadToEnd();
            var error = process.StandardError.ReadToEnd();
            process.WaitForExit();

            if (!string.IsNullOrWhiteSpace(error))
                throw new Exception($"Python error: {error}");

            return output;
        }

        // Hybrid or Cold-start
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetRecommendations(int userId)
        {
            if (userId <= 0)
                return BadRequest("Invalid user_id.");

            bool hasRatings = await _context.movies_ratings.AnyAsync(r => r.user_id == userId);
            string mode = hasRatings ? "recommend" : "cold_start";

            try
            {
                var output = RunPythonScript($"--mode {mode} --user_id {userId}");
                var recs = JsonConvert.DeserializeObject<List<RecommendationDto>>(output);
                return Ok(recs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Recommend by movie
        [HttpPost("by-movie")]
        public IActionResult GetRecommendationsByMovie([FromBody] MovieRecommendationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.show_id))
                return BadRequest("Missing show_id.");

            try
            {
                var output = RunPythonScript($"--mode recommend_by_movie --show_id {request.show_id}");
                var recs = JsonConvert.DeserializeObject<List<RecommendationDto>>(output);
                return Ok(recs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // Optional: Top-rated movies (from DB directly)
        [HttpGet("top-rated")]
        public async Task<IActionResult> GetTopRatedMovies()
        {
            var topRatings = await _context.movies_ratings
                .GroupBy(r => r.show_id)
                .Select(g => new
                {
                    show_id = g.Key,
                    avg = g.Average(r => r.rating)
                })
                .OrderByDescending(x => x.avg)
                .Take(10)
                .ToListAsync();

            var shows = await _context.movies_titles
                .Where(m => topRatings.Select(t => t.show_id).Contains(m.show_id))
                .ToListAsync();

            var result = shows.Select(m => new RecommendationDto
            {
                show_id = m.show_id,
                title = m.title,
                director = m.director,
                cast = m.cast,
                country = m.country,
                release_year = m.release_year,
                rating = m.rating,
                duration = m.duration,
                description = m.description,
                genres = GetGenres(m)
            }).ToList();

            return Ok(result);
        }

        private List<string> GetGenres(Movie movie)
        {
            var genres = new List<string>();
            var props = typeof(Movie).GetProperties();
            foreach (var prop in props)
            {
                if (prop.PropertyType == typeof(bool) && (bool)(prop.GetValue(movie) ?? false))
                {
                    genres.Add(prop.Name.Replace("_", " "));
                }
            }
            return genres;
        }
    }
}

