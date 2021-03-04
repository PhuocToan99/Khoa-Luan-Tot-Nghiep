using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _8 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CourseId",
                table: "Quizs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Quizs_CourseId",
                table: "Quizs",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quizs_Courses_CourseId",
                table: "Quizs",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizs_Courses_CourseId",
                table: "Quizs");

            migrationBuilder.DropIndex(
                name: "IX_Quizs_CourseId",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "Quizs");
        }
    }
}
