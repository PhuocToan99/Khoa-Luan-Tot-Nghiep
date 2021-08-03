using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _9 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuizId",
                table: "Lessons",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VideoQuizTime",
                table: "Lessons",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuizId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "VideoQuizTime",
                table: "Lessons");
        }
    }
}
