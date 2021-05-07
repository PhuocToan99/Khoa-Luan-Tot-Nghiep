using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizs_Lessons_LessonId",
                table: "Quizs");

            migrationBuilder.DropForeignKey(
                name: "FK_Quizs_SubTopics_SubTopicId",
                table: "Quizs");

            migrationBuilder.DropIndex(
                name: "IX_Quizs_SubTopicId",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "SubTopicId",
                table: "Quizs");

            migrationBuilder.RenameColumn(
                name: "LessonId",
                table: "Quizs",
                newName: "TopicId");

            migrationBuilder.RenameIndex(
                name: "IX_Quizs_LessonId",
                table: "Quizs",
                newName: "IX_Quizs_TopicId");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Quizs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "Image",
                table: "Quizs",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "QuestionType",
                table: "Quizs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "QuestionpoolId",
                table: "Quizs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<byte[]>(
                name: "Image",
                table: "Choices",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Questionpools",
                columns: table => new
                {
                    QuestionpoolId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionpoolName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastEdited = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Hastag = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbnailImage = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    LessonId = table.Column<int>(type: "int", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questionpools", x => x.QuestionpoolId);
                    table.ForeignKey(
                        name: "FK_Questionpools_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Questionpools_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "LessonId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Quizs_QuestionpoolId",
                table: "Quizs",
                column: "QuestionpoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Questionpools_CourseId",
                table: "Questionpools",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Questionpools_LessonId",
                table: "Questionpools",
                column: "LessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quizs_Questionpools_QuestionpoolId",
                table: "Quizs",
                column: "QuestionpoolId",
                principalTable: "Questionpools",
                principalColumn: "QuestionpoolId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Quizs_Topics_TopicId",
                table: "Quizs",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "TopicId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizs_Questionpools_QuestionpoolId",
                table: "Quizs");

            migrationBuilder.DropForeignKey(
                name: "FK_Quizs_Topics_TopicId",
                table: "Quizs");

            migrationBuilder.DropTable(
                name: "Questionpools");

            migrationBuilder.DropIndex(
                name: "IX_Quizs_QuestionpoolId",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "QuestionType",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "QuestionpoolId",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Choices");

            migrationBuilder.RenameColumn(
                name: "TopicId",
                table: "Quizs",
                newName: "LessonId");

            migrationBuilder.RenameIndex(
                name: "IX_Quizs_TopicId",
                table: "Quizs",
                newName: "IX_Quizs_LessonId");

            migrationBuilder.AddColumn<int>(
                name: "SubTopicId",
                table: "Quizs",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Quizs_SubTopicId",
                table: "Quizs",
                column: "SubTopicId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quizs_Lessons_LessonId",
                table: "Quizs",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "LessonId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Quizs_SubTopics_SubTopicId",
                table: "Quizs",
                column: "SubTopicId",
                principalTable: "SubTopics",
                principalColumn: "SubTopicId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
