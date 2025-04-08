using Microsoft.EntityFrameworkCore;
using CineNiche.Models;
namespace CineNiche.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) { }
        public DbSet<Movie> movies_titles { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Recommendation> Recommendations { get; set; }
    }
}
