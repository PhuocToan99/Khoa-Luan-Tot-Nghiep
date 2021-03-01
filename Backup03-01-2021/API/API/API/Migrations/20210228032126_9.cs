using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _9 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuizCode",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "QuestionCode",
                table: "Questionpools");

            migrationBuilder.DropColumn(
                name: "QuizCode",
                table: "Questionpools");

            migrationBuilder.DropColumn(
                name: "QuestionCode",
                table: "Choices");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuizCode",
                table: "Quizs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuestionCode",
                table: "Questionpools",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuizCode",
                table: "Questionpools",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuestionCode",
                table: "Choices",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
