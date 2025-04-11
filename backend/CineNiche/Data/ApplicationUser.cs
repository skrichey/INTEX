using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string Zip { get; set; }

    public bool Netflix { get; set; }
    [Column("AmazonPrime")]
    public bool Amazon_Prime { get; set; }
    [Column("DisneyPlus")]
    public bool DisneyPlus { get; set; }
    [Column("ParamountPlus")]
    public bool ParamountPlus { get; set; }
    public bool Max { get; set; }
    public bool Hulu { get; set; }
    [Column("AppleTVPlus")]
    public bool AppleTVPlus { get; set; }
    public bool Peacock { get; set; }
}
