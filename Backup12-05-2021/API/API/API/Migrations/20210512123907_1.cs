using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Notification",
                table: "Notification");

            migrationBuilder.RenameTable(
                name: "Notification",
                newName: "Notifications");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Notifications",
                table: "Notifications",
                column: "NotificationId");

            migrationBuilder.CreateTable(
                name: "ExamQuizs",
                columns: table => new
                {
                    ExamQuizId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ExamQuestion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamIsCorrect = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOption1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOption2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOption3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOption4 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOption5 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamQuestionImageURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOptionImageURL1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOptionImageURL2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOptionImageURL3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOptionImageURL4 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamOptionImageURL5 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamQuestionImage = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ExamOptionImage1 = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ExamOptionImage2 = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ExamOptionImage3 = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ExamOptionImage4 = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ExamOptionImage5 = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ExamTagTopic = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExamCode = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamQuizs", x => x.ExamQuizId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExamQuizs");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Notifications",
                table: "Notifications");

            migrationBuilder.RenameTable(
                name: "Notifications",
                newName: "Notification");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Notification",
                table: "Notification",
                column: "NotificationId");
        }
    }
}
