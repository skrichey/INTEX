using Microsoft.EntityFrameworkCore;
using CineNiche.Models;
namespace CineNiche.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) { }
        public DbSet<Movie> movies_titles { get; set; }
        public DbSet<Rating> movies_ratings { get; set; }
        public DbSet<Recommendation> movies_recommendations { get; set; }
        public DbSet<User> movies_users { get; set; }
    }
}
