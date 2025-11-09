using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace SWAPI_AR.Domain.Entities
{
    public class Starship
    {
        // TODO: Do we need to make any of these required or specify data types/lengths?
        [Key]
        public int Id { get; set; }
        [JsonPropertyName("name")]
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("model")]
        [MaxLength(50)]
        public string Model { get; set; } = string.Empty;
        [JsonPropertyName("manufacturer")]
        [MaxLength(50)]
        public string Manufacturer { get; set; } = string.Empty;
        [JsonPropertyName("cost_in_credits")]
        [MaxLength(50)]
        public string CostInCredits { get; set; } = string.Empty;
        [JsonPropertyName("length")]
        [MaxLength(50)]
        public string Length { get; set; } = string.Empty;
        [JsonPropertyName("max_atmosphering_speed")]
        [MaxLength(50)]
        public string MaxAtmospheringSpeed { get; set; } = string.Empty;
        [JsonPropertyName("crew")]
        [MaxLength(50)]
        public string Crew { get; set; } = string.Empty;
        [JsonPropertyName("passengers")]
        [MaxLength(50)]
        public string Passengers { get; set; } = string.Empty;
        [JsonPropertyName("cargo_capacity")]
        [MaxLength(50)]
        public string CargoCapacity { get; set; } = string.Empty;
        [JsonPropertyName("consumables")]
        [MaxLength(50)]
        public string Consumables { get; set; } = string.Empty;
        [JsonPropertyName("hyperdrive_rating")]
        [MaxLength(50)]
        public string HyperdriveRating { get; set; } = string.Empty;
        [JsonPropertyName("MGLT")]
        [MaxLength(50)]
        public string MGLT { get; set; } = string.Empty;
        [JsonPropertyName("starship_class")]
        [MaxLength(50)]
        public string StarshipClass { get; set; } = string.Empty;
        [JsonPropertyName("pilots")]
        public List<string> Pilots { get; set; } = new();
        [JsonPropertyName("films")]
        public List<string> Films { get; set; } = new();
        [JsonPropertyName("created")]
        public DateTime Created { get; set; }
        [JsonPropertyName("edited")]
        public DateTime Edited { get; set; }
        [JsonPropertyName("url")]
        [MaxLength(100)]
        public string Url { get; set; } = string.Empty;
    }
}
