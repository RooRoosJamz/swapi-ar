using SWAPI_AR.Business.Interfaces;
using SWAPI_AR.Domain.Entities;
using System.Text.Json;

namespace SWAPI_AR.Business.Services
{
    // HttpClient service for SWAPI interactions
    public class SwapiService : ISwapiService
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "https://swapi.info/api";

        public SwapiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<Starship>> GetAllStarshipsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/starships");
                var responseContent = await response.Content.ReadAsStringAsync();
                var starships = JsonSerializer.Deserialize<List<Starship>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return starships ?? new List<Starship>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching starships: {ex.Message}");
                return new List<Starship>();
            }
        }

        public async Task<Starship> GetStarshipByIdAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/starships/{id}");
                var responseContent = await response.Content.ReadAsStringAsync();
                var starship = JsonSerializer.Deserialize<Starship>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                return starship;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching starship with ID {id}: {ex.Message}");
                return null!;
            }
        }

        // Helper methods to get films and pilots names
        public class SwapiFilm
        {
            public string Title { get; set; } = string.Empty;
            public string Url { get; set; } = string.Empty;
        }
        public class SwapiPerson
        {
            public string Name { get; set; } = string.Empty;
            public string Url { get; set; } = string.Empty;
        }
        public async Task<List<SwapiFilm>> GetAllFilmsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/films");
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();
                var films = JsonSerializer.Deserialize<List<SwapiFilm>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return films ?? new List<SwapiFilm>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching films: {ex.Message}");
                return new List<SwapiFilm>();
            }
        }
        
        public async Task<List<SwapiPerson>> GetAllPeopleAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{BaseUrl}/people");
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var people = JsonSerializer.Deserialize<List<SwapiPerson>>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return people ?? new List<SwapiPerson>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching people: {ex.Message}");
                return new List<SwapiPerson>();
            }
        }
    }
}
