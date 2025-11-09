using Microsoft.EntityFrameworkCore;
using SWAPI_AR.Domain.Entities;
using SWAPI_AR.Repository.Data;
using SWAPI_AR.Repository.Repositories.Interfaces;

namespace SWAPI_AR.Repository.Repositories
{
    public class StarshipRepository : IStarshipRepository
    {
        private readonly StarWarsDbContext _context;

        public StarshipRepository(StarWarsDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Starship>> GetAllStarshipsAsync()
        {
            var starships = await _context.Starships.ToListAsync();
            return starships;
        }

        public async Task<Starship?> GetStarshipByIdAsync(int id)
        {
            var starship = await _context.Starships.FindAsync(id);
            return starship;
        }

        public async Task<Starship> AddStarshipAsync(Starship starship)
        {
            _context.Starships.Add(starship);
            await _context.SaveChangesAsync();
            return starship;
        }

        public async Task<Starship> UpdateStarshipAsync(Starship starship)
        {
            _context.Entry(starship).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return starship;
        }

        public async Task DeleteStarshipAsync(int id)
        {
            var starship = await _context.Starships.FindAsync(id);
            if (starship != null)
            {
                _context.Starships.Remove(starship);
                await _context.SaveChangesAsync();
            }
        }
    }
}
