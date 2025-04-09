using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class User
{
    [Key]
    public int user_id { get; set; }
    public string? name { get; set; }
    public int? age { get; set; }
    public string? gender { get; set; }
    public string? city { get; set; }
    public string? state { get; set; }
    public string? zip { get; set; }

    public bool? Netflix { get; set; }
    [Column("Amazon Prime")]
    public bool? Amazon_Prime { get; set; }
    [Column("Disney+")]
    public bool? DisneyPlus { get; set; }
    [Column("Paramount+")]
    public bool? ParamountPlus { get; set; }
    public bool? Max {  get; set; }
    public bool? Hulu { get; set; }
    [Column("Apple TV+")]
    public bool? AppleTVPlus {  get; set; }
    public bool Peacock { get; set; }

    public string? password { get; set; }
    public bool is_admin { get; set; }
}
