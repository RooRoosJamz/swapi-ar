using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SWAPI_AR.Business.Interfaces;

namespace SWAPI_AR.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StarshipSeederController : Controller
    {
        private readonly IStarshipSeederService _starshipSeederService;

        public StarshipSeederController(IStarshipSeederService starshipSeederService)
        {
            _starshipSeederService = starshipSeederService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("seed")]
        public async Task<IActionResult> SeedStarships()
        {
            await _starshipSeederService.SeedStarshipsAsync();
            return Ok("Starships seeded successfully.");
        }
    }
}
