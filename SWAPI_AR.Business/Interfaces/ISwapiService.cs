using SWAPI_AR.Domain.Entities;
using static SWAPI_AR.Business.Services.SwapiService;

namespace SWAPI_AR.Business.Interfaces
{
    public interface ISwapiService
    {
        Task<List<Starship>> GetAllStarshipsAsync();
        Task<Starship> GetStarshipByIdAsync(int id);
        Task<List<SwapiFilm>> GetAllFilmsAsync();
        Task<List<SwapiPerson>> GetAllPeopleAsync();
    }
}