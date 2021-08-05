using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _12 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFinalQuiz",
                table: "ExamQuizs",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFinalQuiz",
                table: "ExamQuizs");
        }
    }
}
