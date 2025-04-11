using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CineNiche.Models;
using Microsoft.AspNetCore.Identity;

namespace CineNiche.Data
{
    // Inherit from IdentityDbContext to integrate Identity
    public class MovieDbContext : IdentityDbContext<ApplicationUser>
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) { }

        // Your existing DbSet properties
        public DbSet<Movie> movies_titles { get; set; }
        public DbSet<Rating> AspNetMoviesRatings { get; set; }
        public DbSet<Recommendation> movies_recommendations { get; set; }
        public DbSet<ApplicationUser> AspNetUsers { get; set; }
    }
}
