using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _10 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizs_SubTopics_SubTopicId",
                table: "Quizs");

            migrationBuilder.DropIndex(
                name: "IX_Quizs_SubTopicId",
                table: "Quizs");

            migrationBuilder.DropColumn(
                name: "SubTopicId",
                table: "Quizs");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                name: "FK_Quizs_SubTopics_SubTopicId",
                table: "Quizs",
                column: "SubTopicId",
                principalTable: "SubTopics",
                principalColumn: "SubTopicId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
