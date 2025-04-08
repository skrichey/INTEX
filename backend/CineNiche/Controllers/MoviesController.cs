using Microsoft.AspNetCore.Mvc;
using CineNiche.Data;
using CineNiche.Models;
using System;

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

        [HttpGet]
        public IActionResult GetAllMovies()
        {
            var movies = _context.movies_titles.ToList();
            return Ok(movies);
        }

        [HttpGet("{id}")]
        public IActionResult GetMovie(string id)
        {
            var movie = _context.movies_titles.FirstOrDefault(m => m.show_id == id);
            if (movie == null) return NotFound();
            return Ok(movie);
        }
    }
}