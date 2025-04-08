using System.Collections.Generic;

namespace CineNiche.Data
{
    public class MovieDto
    {
        public string show_id { get; set; }
        public string? title { get; set; }
        public string? director { get; set; }
        public string? cast { get; set; }
        public string? country { get; set; }
        public int? release_year { get; set; }
        public string? rating { get; set; }
        public string? duration { get; set; }
        public string? description { get; set; }
        public List<string> genres { get; set; } = new();

        public static List<string> ExtractGenres(Movie movie)
        {
            var genres = new List<string>();
            if (movie.Action) genres.Add("Action");
            if (movie.Adventure) genres.Add("Adventure");
            if (movie.Anime_Series_International_TV_Shows) genres.Add("Anime Series International TV Shows");
            if (movie.British_TV_Shows_Docuseries_International_TV_Shows) genres.Add("British TV Shows Docuseries International TV Shows");
            if (movie.Children) genres.Add("Children");
            if (movie.Comedies) genres.Add("Comedies");
            if (movie.Comedies_Dramas_International_Movies) genres.Add("Comedies Dramas International Movie");
            if (movie.Comedies_International_Movies) genres.Add("Comedies International Movies");
            if (movie.Comedies_Romantic_Movies) genres.Add("Comedies Romantic Movies");
            if (movie.Crime_TV_Shows_Docuseries) genres.Add("Crime TV Shows Docuseries");
            if (movie.Documentaries) genres.Add("Documentaries");
            if (movie.Documentaries_International_Movies) genres.Add("Documentaries International Movies");
            if (movie.Docuseries) genres.Add("Docuseries");
            if (movie.Dramas) genres.Add("Dramas");
            if (movie.Dramas_International_Movies) genres.Add("Dramas International Movies");
            if (movie.Dramas_Romantic_Movies) genres.Add("Dramas Romantic Movies");
            if (movie.Family_Movies) genres.Add("Family Movies");
            if (movie.Fantasy) genres.Add("Fantasy");
            if (movie.Horror_Movies) genres.Add("Horror Movies");
            if (movie.International_Movies_Thrillers) genres.Add("International Movies Thrillers");
            if (movie.International_TV_Shows_Romantic_TV_Shows_TV_Dramas) genres.Add("International TV Shows Romantic TV Shows TV Dramas");
            if (movie.Kids_TV) genres.Add("Kids' TV");
            if (movie.Language_TV_Shows) genres.Add("Language TV Shows");
            if (movie.Musicals) genres.Add("Musicals");
            if (movie.Nature_TV) genres.Add("Nature TV");
            if (movie.Reality_TV) genres.Add("Reality TV");
            if (movie.Spirituality) genres.Add("Spirituality");
            if (movie.TV_Action) genres.Add("TV Action");
            if (movie.TV_Comedies) genres.Add("TV Comedies");
            if (movie.TV_Dramas) genres.Add("TV Dramas");
            if (movie.Talk_Shows_TV_Comedies) genres.Add("Talk Shows TV Comedies");
            if (movie.Thrillers) genres.Add("Thrillers");
            return genres;
        }

        public static void ApplyGenres(Movie movie, List<string> genres)
        {
            movie.Action = genres.Contains("Action");
            movie.Adventure = genres.Contains("Adventure");
            movie.Anime_Series_International_TV_Shows = genres.Contains("Anime Series International TV Shows");
            movie.British_TV_Shows_Docuseries_International_TV_Shows = genres.Contains("British TV Shows Docuseries International TV Shows");
            movie.Children = genres.Contains("Children");
            movie.Comedies = genres.Contains("Comedies");
            movie.Comedies_Dramas_International_Movies = genres.Contains("Comedies Dramas International Movie");
            movie.Comedies_International_Movies = genres.Contains("Comedies International Movies");
            movie.Comedies_Romantic_Movies = genres.Contains("Comedies Romantic Movies");
            movie.Crime_TV_Shows_Docuseries = genres.Contains("Crime TV Shows Docuseries");
            movie.Documentaries = genres.Contains("Documentaries");
            movie.Documentaries_International_Movies = genres.Contains("Documentaries International Movies");
            movie.Docuseries = genres.Contains("Docuseries");
            movie.Dramas = genres.Contains("Dramas");
            movie.Dramas_International_Movies = genres.Contains("Dramas International Movies");
            movie.Dramas_Romantic_Movies = genres.Contains("Dramas Romantic Movies");
            movie.Family_Movies = genres.Contains("Family Movies");
            movie.Fantasy = genres.Contains("Fantasy");
            movie.Horror_Movies = genres.Contains("Horror Movies");
            movie.International_Movies_Thrillers = genres.Contains("International Movies Thrillers");
            movie.International_TV_Shows_Romantic_TV_Shows_TV_Dramas = genres.Contains("International TV Shows Romantic TV Shows TV Dramas");
            movie.Kids_TV = genres.Contains("Kids' TV");
            movie.Language_TV_Shows = genres.Contains("Language TV Shows");
            movie.Musicals = genres.Contains("Musicals");
            movie.Nature_TV = genres.Contains("Nature TV");
            movie.Reality_TV = genres.Contains("Reality TV");
            movie.Spirituality = genres.Contains("Spirituality");
            movie.TV_Action = genres.Contains("TV Action");
            movie.TV_Comedies = genres.Contains("TV Comedies");
            movie.TV_Dramas = genres.Contains("TV Dramas");
            movie.Talk_Shows_TV_Comedies = genres.Contains("Talk Shows TV Comedies");
            movie.Thrillers = genres.Contains("Thrillers");
        }

        public static MovieDto ToDto(Movie movie)
        {
            return new MovieDto
            {
                show_id = movie.show_id,
                title = movie.title,
                director = movie.director,
                cast = movie.cast,
                country = movie.country,
                release_year = movie.release_year,
                rating = movie.rating,
                duration = movie.duration,
                description = movie.description,
                genres = ExtractGenres(movie)
            };
        }
    }
}
