using Microsoft.EntityFrameworkCore;
using SWAPI_AR.Domain.Entities;
using System.Text.Json;

namespace SWAPI_AR.Repository.Data
{
    public class StarWarsDbContext : DbContext
    {
        public StarWarsDbContext(DbContextOptions<StarWarsDbContext> options) : base(options)
        {
        }

        public DbSet<Starship> Starships { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var jsonOptions = new JsonSerializerOptions();

            // Serialize List<string> properties as JSON strings in the database
            // In a production app, would consider using a separate table for many-to-many relationships
            modelBuilder.Entity<Starship>()
                .Property(s => s.Pilots)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, jsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, jsonOptions) ?? new List<string>());

            modelBuilder.Entity<Starship>()
                .Property(s => s.Films)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, jsonOptions),
                    v => JsonSerializer.Deserialize<List<string>>(v, jsonOptions) ?? new List<string>());

            // Add Indexes
            // Note: Indexes not necessary for small datasets, but added here for demonstration
            modelBuilder.Entity<Starship>()
                .HasIndex(s => s.Name)
                .HasDatabaseName("IX_Starship_Name");

            modelBuilder.Entity<Starship>()
                .HasIndex(s => s.Manufacturer)
                .HasDatabaseName("IX_Starship_Manufacturer");

            modelBuilder.Entity<Starship>()
                .HasIndex(s => s.StarshipClass)
                .HasDatabaseName("IX_StarshipClass");
        }
    }
}
