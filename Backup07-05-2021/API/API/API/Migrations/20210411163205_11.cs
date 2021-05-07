using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _11 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Level",
                table: "Questionpools",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShareMethod",
                table: "Questionpools",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Level",
                table: "Questionpools");

            migrationBuilder.DropColumn(
                name: "ShareMethod",
                table: "Questionpools");
        }
    }
}
