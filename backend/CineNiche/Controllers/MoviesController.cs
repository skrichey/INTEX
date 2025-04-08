using Microsoft.AspNetCore.Mvc;
using CineNiche.Data;
using CineNiche.Models;

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
        public IActionResult GetAllMovies()
        {
            var movies = _context.movies_titles.ToList();
            return Ok(movies);
        }

        // GET: api/movies/{id}
        [HttpGet("{id}")]
        public IActionResult GetMovie(string id)
        {
            var movie = _context.movies_titles.FirstOrDefault(m => m.show_id == id);
            if (movie == null) return NotFound(new { message = "Movie not found." });
            return Ok(movie);
        }

        // POST: api/movies
        [HttpPost]
        public IActionResult AddMovie([FromBody] Movie movie)
        {
            if (_context.movies_titles.Any(m => m.show_id == movie.show_id))
            {
                return BadRequest(new { message = "A movie with this ID already exists." });
            }

            _context.movies_titles.Add(movie);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetMovie), new { id = movie.show_id }, movie);
        }

        // PUT: api/movies/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateMovie(string id, [FromBody] Movie updatedMovie)
        {
            var existing = _context.movies_titles.FirstOrDefault(m => m.show_id == id);
            if (existing == null) return NotFound(new { message = "Movie not found." });

            // Manually update all fields except the primary key
            existing.title = updatedMovie.title;
            existing.director = updatedMovie.director;
            existing.cast = updatedMovie.cast;
            existing.country = updatedMovie.country;
            existing.release_year = updatedMovie.release_year;
            existing.rating = updatedMovie.rating;
            existing.duration = updatedMovie.duration;
            existing.description = updatedMovie.description;

            _context.SaveChanges();

            return Ok(existing);
        }


        // DELETE: api/movies/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteMovie(string id)
        {
            var movie = _context.movies_titles.FirstOrDefault(m => m.show_id == id);
            if (movie == null) return NotFound(new { message = "Movie not found." });

            _context.movies_titles.Remove(movie);
            _context.SaveChanges();

            return Ok(new { message = "Movie deleted successfully." });
        }
    }
}
