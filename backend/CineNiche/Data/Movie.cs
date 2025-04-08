using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Movie
{
    [Key]
    public string show_id { get; set; }
    public string? title { get; set; }
    public string? director { get; set; }
    public string? cast { get; set; }
    public string? country { get; set; }
    public int? release_year { get; set; }
    public string? rating { get; set; }
    public string? duration { get; set; }
    public string? description { get; set; }

    #region Genre Booleans
    [Column("Action")]
    public bool Action { get; set; }

    [Column("Adventure")]
    public bool Adventure { get; set; }

    [Column("Anime Series International TV Shows")]
    public bool Anime_Series_International_TV_Shows { get; set; }

    [Column("British TV Shows Docuseries International TV Shows")]
    public bool British_TV_Shows_Docuseries_International_TV_Shows { get; set; }

    [Column("Children")]
    public bool Children { get; set; }

    [Column("Comedies")]
    public bool Comedies { get; set; }
    [Column("Comedies Dramas International Movies")]
    public bool Comedies_Dramas_International_Movies { get; set; }

    [Column("Comedies International Movies")]
    public bool Comedies_International_Movies { get; set; }

    [Column("Comedies Romantic Movies")]
    public bool Comedies_Romantic_Movies { get; set; }

    [Column("Crime TV Shows Docuseries")]
    public bool Crime_TV_Shows_Docuseries { get; set; }

    [Column("Documentaries")]
    public bool Documentaries { get; set; }

    [Column("Documentaries International Movies")]
    public bool Documentaries_International_Movies { get; set; }

    [Column("Docuseries")]
    public bool Docuseries { get; set; }

    [Column("Dramas")]
    public bool Dramas { get; set; }

    [Column("Dramas International Movies")]
    public bool Dramas_International_Movies { get; set; }

    [Column("Dramas Romantic Movies")]
    public bool Dramas_Romantic_Movies { get; set; }

    [Column("Family Movies")]
    public bool Family_Movies { get; set; }

    [Column("Fantasy")]
    public bool Fantasy { get; set; }

    [Column("Horror Movies")]
    public bool Horror_Movies { get; set; }

    [Column("International Movies Thrillers")]
    public bool International_Movies_Thrillers { get; set; }

    [Column("International TV Shows Romantic TV Shows TV Dramas")]
    public bool International_TV_Shows_Romantic_TV_Shows_TV_Dramas { get; set; }

    [Column("Kids' TV")]
    public bool Kids_TV { get; set; }

    [Column("Language TV Shows")]
    public bool Language_TV_Shows { get; set; }

    [Column("Musicals")]
    public bool Musicals { get; set; }

    [Column("Nature TV")]
    public bool Nature_TV { get; set; }

    [Column("Reality TV")]
    public bool Reality_TV { get; set; }

    [Column("Spirituality")]
    public bool Spirituality { get; set; }

    [Column("TV Action")]
    public bool TV_Action { get; set; }

    [Column("TV Comedies")]
    public bool TV_Comedies { get; set; }

    [Column("TV Dramas")]
    public bool TV_Dramas { get; set; }

    [Column("Talk Shows TV Comedies")]
    public bool Talk_Shows_TV_Comedies { get; set; }

    [Column("Thrillers")]
    public bool Thrillers { get; set; }


    #endregion

}