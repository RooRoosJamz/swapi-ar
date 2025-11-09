using SWAPI_AR.Business.Interfaces;
using SWAPI_AR.Repository.Data;

namespace SWAPI_AR.Business.Services
{
    public class StarshipSeederService : IStarshipSeederService
    {
        private readonly StarWarsDbContext _context;
        private readonly ISwapiService _swapiService;

        public StarshipSeederService(StarWarsDbContext context, ISwapiService swapiService)
        {
            _context = context;
            _swapiService = swapiService;
        }

        public async Task SeedStarshipsAsync()
        {
            // Use a transaction to ensure data full seeding integrity
            var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Remove existing starships and reseed.
                _context.Starships.RemoveRange(_context.Starships);
                await _context.SaveChangesAsync();

                Console.WriteLine("Seeding starships from SWAPI...");
                // Fetch all starships from SWAPI
                var starships = await _swapiService.GetAllStarshipsAsync();
                // Fetch all films from SWAPI
                var allFilms = await _swapiService.GetAllFilmsAsync();
                var filmCache = allFilms.ToDictionary(f => f.Url, f => f.Title);
                // Fetch all pilots from SWAPI
                var allPilots = await _swapiService.GetAllPeopleAsync();
                var pilotCache = allPilots.ToDictionary(p => p.Url, p => p.Name);

                foreach (var starship in starships)
                {
                    starship.Id = 0; // Reset ID to let the database assign a new one

                    // Map film URLs to names
                    starship.Films = starship.Films
                        .Where(url => filmCache.ContainsKey(url))
                        .Select(url => filmCache[url])
                        .ToList();

                    // Map pilot URLs to names
                    starship.Pilots = starship.Pilots
                        .Where(url => pilotCache.ContainsKey(url))
                        .Select(url => pilotCache[url])
                        .ToList();
                }
                _context.Starships.AddRange(starships);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                Console.WriteLine($"Seeded {starships.Count} starships.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error seeding starships: {ex.Message}");
            }
        }
    }
}
