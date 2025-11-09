using SWAPI_AR.Domain.Entities;

namespace SWAPI_AR.Repository.Repositories.Interfaces
{
    public interface IStarshipRepository
    {
        Task<Starship> AddStarshipAsync(Starship starship);
        Task DeleteStarshipAsync(int id);
        Task<IEnumerable<Starship>> GetAllStarshipsAsync();
        Task<Starship?> GetStarshipByIdAsync(int id);
        Task<Starship> UpdateStarshipAsync(Starship starship);
    }
}