using System.ComponentModel.DataAnnotations;

namespace CineNiche.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public string user_id { get; set; }
        public string show_id { get; set; }
        public int rating { get; set; } // This maps to "rating" in your CSV
    }
}