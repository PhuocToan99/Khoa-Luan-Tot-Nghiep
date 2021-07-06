using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _8 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsLiked",
                table: "AccountinCourses");

            migrationBuilder.AddColumn<bool>(
                name: "IsCart",
                table: "AccountinCourses",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCart",
                table: "AccountinCourses");

            migrationBuilder.AddColumn<bool>(
                name: "IsLiked",
                table: "AccountinCourses",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
