using SWAPI_AR.Domain.Entities;

namespace SWAPI_AR.Business.Interfaces
{
    public interface IStarshipService
    {
        Task<IEnumerable<Starship>> GetAllStarshipsAsync();
        Task<Starship?> GetStarshipByIdAsync(int id);
        Task<Starship> AddStarshipAsync(Starship starship);
        Task<Starship?> UpdateStarshipAsync(int id, Starship starship);
        Task DeleteStarshipAsync(int id);
    }
}
