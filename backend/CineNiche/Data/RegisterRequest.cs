namespace CineNiche.Data
{
    public class RegisterRequest
    {
        public string Email { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Password { get; set; } = default!;
        public int Age { get; set; }
        public string Gender { get; set; } = default!;
        public string City { get; set; } = default!;
        public string State { get; set; } = default!;
        public string Zip { get; set; } = default!;

        public List<int> Preferences { get; set; } = new List<int>(new int[8]);
    }
}
