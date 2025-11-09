using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSubstitute;
using SWAPI_AR.Api.Controllers;
using SWAPI_AR.Business.Interfaces;
using SWAPI_AR.Domain.Entities;

namespace SWAPI_AR.Tests.Controllers
{
    public class StarshipControllerTests
    {
        private readonly IStarshipService _service = Substitute.For<IStarshipService>();
        private readonly ILogger<StarshipController> _logger = Substitute.For<ILogger<StarshipController>>();
        private readonly StarshipController _controller;

        public StarshipControllerTests()
        {
            _controller = new StarshipController(_service, _logger);
        }

        [Fact]
        public async Task GetAllStarships_ReturnsOk_WithStarships()
        {
            var ships = new List<Starship> { new Starship { Id = 1, Name = "Falcon" } };
            _service.GetAllStarshipsAsync().Returns(ships);

            var result = await _controller.GetAllStarships() as OkObjectResult;

            Assert.NotNull(result);
            var value = Assert.IsType<List<Starship>>(result.Value);
            Assert.Single(value);
        }

        [Fact]
        public async Task GetAllStarships_ReturnsNotFound_WhenEmpty()
        {
            _service.GetAllStarshipsAsync().Returns(new List<Starship>());

            var result = await _controller.GetAllStarships();

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetStarshipById_ReturnsOk_WhenExists()
        {
            var ship = new Starship { Id = 1, Name = "Falcon" };
            _service.GetStarshipByIdAsync(1).Returns(ship);

            var result = await _controller.GetStarshipById(1);

            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Falcon", ((Starship)okResult.Value!).Name);
        }

        [Fact]
        public async Task GetStarshipById_ReturnsNotFound_WhenNotExists()
        {
            _service.GetStarshipByIdAsync(1).Returns((Starship?)null);

            var result = await _controller.GetStarshipById(1);

            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task AddStarship_ReturnsCreatedAtAction()
        {
            var ship = new Starship { Name = "X-Wing" };
            var created = new Starship { Id = 42, Name = "X-Wing" };
            _service.AddStarshipAsync(ship).Returns(created);

            var result = await _controller.AddStarship(ship);

            var createdAtAction = Assert.IsType<CreatedAtActionResult>(result);
            var value = Assert.IsType<Starship>(createdAtAction.Value!);
            Assert.Equal(42, value.Id);
        }

        [Fact]
        public async Task AddStarship_ReturnsBadRequest_WhenNull()
        {
            var result = await _controller.AddStarship(null!);
            var badRequest = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Starship object is null", badRequest.Value);
        }
    }
}
