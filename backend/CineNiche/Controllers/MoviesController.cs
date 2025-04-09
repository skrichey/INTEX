using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CineNiche.Data;
using CineNiche.Models;
using System.Linq;

namespace CineNiche.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly MovieDbContext _context;

        public MoviesController(MovieDbContext context)
        {
            _context = context;
        }

        // GET: api/movies
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAllMovies([FromQuery] int page = 1, [FromQuery] int pageSize = 28)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0 || pageSize > 100) pageSize = 28;

            var skip = (page - 1) * pageSize;

            var pagedMovies = _context.movies_titles
                .OrderBy(m => m.title)
                .Skip(skip)
                .Take(pageSize)
                .Select(movie => MovieDto.ToDto(movie))
                .ToList();

            var totalCount = _context.movies_titles.Count();

            return Ok(new
            {
                page,
                pageSize,
                totalCount,
                totalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                movies = pagedMovies
            });
        }

        // GET: api/movies/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetMovie(string id)
        {
            var movie = _context.movies_titles.FirstOrDefault(m => m.show_id == id);
            if (movie == null)
                return NotFound(new { message = "Movie not found." });

            return Ok(MovieDto.ToDto(movie));
        }

        // POST: api/movies
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult AddMovie([FromBody] MovieDto movieDto)
        {
            if (_context.movies_titles.Any(m => m.show_id == movieDto.show_id))
                return BadRequest(new { message = "A movie with this ID already exists." });

            var movie = new Movie
            {
                show_id = movieDto.show_id,
                title = movieDto.title,
                director = movieDto.director,
                cast = movieDto.cast,
                country = movieDto.country,
                release_year = movieDto.release_year,
                rating = movieDto.rating,
                duration = movieDto.duration,
                description = movieDto.description
            };

            MovieDto.ApplyGenres(movie, movieDto.genres);

            _context.movies_titles.Add(movie);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMovie), new { id = movie.show_id }, MovieDto.ToDto(movie));
        }

        // PUT: api/movies/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult UpdateMovie(string id, [FromBody] MovieDto movieDto)
        {
            var movie = _context.movies_titles.FirstOrDefault(m => m.show_id == id);
            if (movie == null)
                return NotFound(new { message = "Movie not found." });

            movie.title = movieDto.title;
            movie.director = movieDto.director;
            movie.cast = movieDto.cast;
            movie.country = movieDto.country;
            movie.release_year = movieDto.release_year;
            movie.rating = movieDto.rating;
            movie.duration = movieDto.duration;
            movie.description = movieDto.description;

            MovieDto.ApplyGenres(movie, movieDto.genres);

            _context.SaveChanges();

            return Ok(MovieDto.ToDto(movie));
        }

        // DELETE: api/movies/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteMovie(string id)
        {
            var movie = _context.movies_titles.FirstOrDefault(m => m.show_id == id);
            if (movie == null)
                return NotFound(new { message = "Movie not found." });

            _context.movies_titles.Remove(movie);
            _context.SaveChanges();

            return Ok(new { message = "Movie deleted successfully." });
        }
    }
}
