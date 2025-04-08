using System.ComponentModel.DataAnnotations;
namespace CineNiche.Models
{
    public class Recommendation
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ShowId { get; set; } = null!;
        public double? Score { get; set; }  // optional confidence score
    }
}
