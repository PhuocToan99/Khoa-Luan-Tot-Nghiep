using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quizs_Topics_TopicId",
                table: "Quizs");

            migrationBuilder.DropIndex(
                name: "IX_Quizs_TopicId",
                table: "Quizs");

            migrationBuilder.AlterColumn<string>(
                name: "TopicId",
                table: "Quizs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TopicId",
                table: "Quizs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Quizs_TopicId",
                table: "Quizs",
                column: "TopicId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quizs_Topics_TopicId",
                table: "Quizs",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "TopicId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
