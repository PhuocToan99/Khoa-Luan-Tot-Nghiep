using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CourseVideo",
                table: "Courses");

            migrationBuilder.RenameColumn(
                name: "ThumbnaiImage",
                table: "Courses",
                newName: "ThumbnailImage");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ThumbnailImage",
                table: "Courses",
                newName: "ThumbnaiImage");

            migrationBuilder.AddColumn<byte[]>(
                name: "CourseVideo",
                table: "Courses",
                type: "varbinary(max)",
                nullable: true);
        }
    }
}
