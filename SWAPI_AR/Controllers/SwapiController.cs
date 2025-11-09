using Microsoft.AspNetCore.Mvc;
using SWAPI_AR.Business.Interfaces;

namespace SWAPI_AR.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SwapiController : Controller
    {
        private readonly ILogger<SwapiController> _logger;
        private readonly ISwapiService _swapiService;

        public SwapiController(ILogger<SwapiController> logger, ISwapiService swapiService)
        {
            _logger = logger;
            _swapiService = swapiService;
        }

        // Public api to retreve all star wars people names avaialbe
        [HttpGet("people")]
        public async Task<IActionResult> GetAllPeopleAsync()
        {
            try
            {
                var people = await _swapiService.GetAllPeopleAsync();
                return Ok(people);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching people from SWAPI");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
