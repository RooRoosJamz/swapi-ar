using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SWAPI_AR.Repository.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Starships",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Model = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Manufacturer = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CostInCredits = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Length = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaxAtmospheringSpeed = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Crew = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Passengers = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CargoCapacity = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Consumables = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HyperdriveRating = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MGLT = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StarshipClass = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Pilots = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Films = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Edited = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Starships", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Starship_Manufacturer",
                table: "Starships",
                column: "Manufacturer");

            migrationBuilder.CreateIndex(
                name: "IX_Starship_Name",
                table: "Starships",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_StarshipClass",
                table: "Starships",
                column: "StarshipClass");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Starships");
        }
    }
}
