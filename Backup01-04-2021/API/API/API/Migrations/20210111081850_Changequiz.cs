using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class Changequiz : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "SubTopicId",
                table: "Quizs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "LessonId",
                table: "Quizs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Time",
                table: "Quizs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Quizs_LessonId",
                table: "Quizs",
                column: "LessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quizs_Lessons_LessonId",
                table: "Quizs",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "LessonId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizs_Lessons_LessonId",
                table: "Quizs");

            migrationBuilder.DropIndex(
                name: "IX_Quizs_LessonId",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "LessonId",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "Quizs");

            migrationBuilder.AlterColumn<int>(
                name: "SubTopicId",
                table: "Quizs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
