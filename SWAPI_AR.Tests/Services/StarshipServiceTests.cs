using NSubstitute;
using SWAPI_AR.Business.Interfaces;
using SWAPI_AR.Business.Services;
using SWAPI_AR.Domain.Entities;
using SWAPI_AR.Repository.Repositories.Interfaces;

namespace SWAPI_AR.Tests.Services
{
    public class StarshipServiceTests
    {
        private readonly IStarshipRepository _repo = Substitute.For<IStarshipRepository>();
        private readonly IStarshipService _service;

        public StarshipServiceTests()
        {
            _service = new StarshipService(_repo);
        }

        [Fact]
        public async Task GetAllStarshipsAsync_ReturnsAllStarships()
        {
            var starships = new List<Starship>
            {
                new Starship { Id = 1, Name = "Falcon" },
                new Starship { Id = 2, Name = "Destroyer" }
            };
            _repo.GetAllStarshipsAsync().Returns(starships);

            var result = await _service.GetAllStarshipsAsync();

            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetStarshipByIdAsync_ReturnsStarship_WhenExists()
        {
            var ship = new Starship { Id = 1, Name = "Falcon" };
            _repo.GetStarshipByIdAsync(1).Returns(ship);

            var result = await _service.GetStarshipByIdAsync(1);

            Assert.NotNull(result);
            Assert.Equal("Falcon", result.Name);
        }

        [Fact]
        public async Task GetStarshipByIdAsync_ReturnsNull_WhenNotExists()
        {
            _repo.GetStarshipByIdAsync(1).Returns((Starship?)null);

            var result = await _service.GetStarshipByIdAsync(1);

            Assert.Null(result);
        }

        [Fact]
        public async Task AddStarshipAsync_CallsRepoAndReturnsStarship()
        {
            var ship = new Starship { Name = "X-Wing" };
            var createdShip = new Starship { Id = 42, Name = "X-Wing" };
            _repo.AddStarshipAsync(ship).Returns(createdShip);

            var result = await _service.AddStarshipAsync(ship);

            Assert.Equal(42, result.Id);
            await _repo.Received(1).AddStarshipAsync(ship);
        }

        [Fact]
        public async Task UpdateStarshipAsync_UpdatesFields_WhenExists()
        {
            var existing = new Starship { Id = 1, Name = "Old Name" };
            var updated = new Starship { Name = "New Name" };
            _repo.GetStarshipByIdAsync(1).Returns(existing);
            _repo.UpdateStarshipAsync(existing).Returns(existing);

            var result = await _service.UpdateStarshipAsync(1, updated);

            Assert.Equal("New Name", result.Name);
            await _repo.Received(1).UpdateStarshipAsync(existing);
        }
    }
}
