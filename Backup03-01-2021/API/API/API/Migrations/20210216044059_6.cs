using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choices_Quizs_QuizId",
                table: "Choices");

            migrationBuilder.DropColumn(
                name: "Time",
                table: "Quizs");

            migrationBuilder.RenameColumn(
                name: "Question",
                table: "Quizs",
                newName: "QuizName");

            migrationBuilder.RenameColumn(
                name: "QuizId",
                table: "Choices",
                newName: "QuestionpoolId");

            migrationBuilder.RenameIndex(
                name: "IX_Choices_QuizId",
                table: "Choices",
                newName: "IX_Choices_QuestionpoolId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Quizs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Hastag",
                table: "Quizs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastEdited",
                table: "Quizs",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "QuizCode",
                table: "Quizs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ThumbnailImage",
                table: "Quizs",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "Image",
                table: "Choices",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuestionCode",
                table: "Choices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Questionpools",
                columns: table => new
                {
                    QuestionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Image = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    TopicId = table.Column<int>(type: "int", nullable: false),
                    Time = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuizCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuestionCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuizId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questionpools", x => x.QuestionId);
                    table.ForeignKey(
                        name: "FK_Questionpools_Quizs_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizs",
                        principalColumn: "QuizId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Questionpools_Topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topics",
                        principalColumn: "TopicId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Questionpools_QuizId",
                table: "Questionpools",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_Questionpools_TopicId",
                table: "Questionpools",
                column: "TopicId");

            migrationBuilder.AddForeignKey(
                name: "FK_Choices_Questionpools_QuestionpoolId",
                table: "Choices",
                column: "QuestionpoolId",
                principalTable: "Questionpools",
                principalColumn: "QuestionId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Choices_Questionpools_QuestionpoolId",
                table: "Choices");

            migrationBuilder.DropTable(
                name: "Questionpools");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "Hastag",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "LastEdited",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "QuizCode",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "ThumbnailImage",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Choices");

            migrationBuilder.DropColumn(
                name: "QuestionCode",
                table: "Choices");

            migrationBuilder.RenameColumn(
                name: "QuizName",
                table: "Quizs",
                newName: "Question");

            migrationBuilder.RenameColumn(
                name: "QuestionpoolId",
                table: "Choices",
                newName: "QuizId");

            migrationBuilder.RenameIndex(
                name: "IX_Choices_QuestionpoolId",
                table: "Choices",
                newName: "IX_Choices_QuizId");

            migrationBuilder.AddColumn<int>(
                name: "Time",
                table: "Quizs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Choices_Quizs_QuizId",
                table: "Choices",
                column: "QuizId",
                principalTable: "Quizs",
                principalColumn: "QuizId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
