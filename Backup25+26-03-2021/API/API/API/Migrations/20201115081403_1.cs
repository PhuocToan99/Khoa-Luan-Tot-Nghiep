using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Migrations
{
    public partial class _1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FAQs",
                columns: table => new
                {
                    FAQId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FAQQuestion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FAQAnswer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FAQs", x => x.FAQId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLogOnDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AvatarPath = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Balance = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Accounts",
                columns: table => new
                {
                    AccountId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Userame = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Verification = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accounts", x => x.AccountId);
                    table.ForeignKey(
                        name: "FK_Accounts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    CourseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CourseName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    NumberOfVoters = table.Column<double>(type: "float", nullable: false),
                    NumberOfParticipants = table.Column<double>(type: "float", nullable: false),
                    Price = table.Column<float>(type: "real", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CourseDuration = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ThumbnaiImage = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Hastag = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CourseVideo = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Level = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastUpdate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AccountId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.CourseId);
                    table.ForeignKey(
                        name: "FK_Courses_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "AccountId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AccountinCourses",
                columns: table => new
                {
                    AccountinCourseID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountinCourses", x => x.AccountinCourseID);
                    table.ForeignKey(
                        name: "FK_AccountinCourses_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "AccountId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccountinCourses_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Topics",
                columns: table => new
                {
                    TopicId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TopicTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SessionNumber = table.Column<int>(type: "int", nullable: false),
                    LastUpdate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topics", x => x.TopicId);
                    table.ForeignKey(
                        name: "FK_Topics_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SubTopics",
                columns: table => new
                {
                    SubTopicId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubTopicTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubTopicNumber = table.Column<int>(type: "int", nullable: false),
                    TopicId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubTopics", x => x.SubTopicId);
                    table.ForeignKey(
                        name: "FK_SubTopics_Topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topics",
                        principalColumn: "TopicId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    LessonId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LessonTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LessonContent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LessonNo = table.Column<int>(type: "int", nullable: false),
                    SubTopicId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.LessonId);
                    table.ForeignKey(
                        name: "FK_Lessons_SubTopics_SubTopicId",
                        column: x => x.SubTopicId,
                        principalTable: "SubTopics",
                        principalColumn: "SubTopicId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Quizs",
                columns: table => new
                {
                    QuizId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Question = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Point = table.Column<int>(type: "int", nullable: false),
                    SubTopicId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quizs", x => x.QuizId);
                    table.ForeignKey(
                        name: "FK_Quizs_SubTopics_SubTopicId",
                        column: x => x.SubTopicId,
                        principalTable: "SubTopics",
                        principalColumn: "SubTopicId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AccountinLessons",
                columns: table => new
                {
                    AccountinLessonID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    LessonId = table.Column<int>(type: "int", nullable: false),
                    Point = table.Column<int>(type: "int", nullable: false),
                    LastTaken = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountinLessons", x => x.AccountinLessonID);
                    table.ForeignKey(
                        name: "FK_AccountinLessons_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "AccountId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AccountinLessons_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "LessonId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    CommentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CommentContent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    DatePost = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ParentCommentId = table.Column<int>(type: "int", nullable: true),
                    AccountId = table.Column<int>(type: "int", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: true),
                    LessonId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.CommentId);
                    table.ForeignKey(
                        name: "FK_Comments_Accounts_AccountId",
                        column: x => x.AccountId,
                        principalTable: "Accounts",
                        principalColumn: "AccountId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Comments_Comments_ParentCommentId",
                        column: x => x.ParentCommentId,
                        principalTable: "Comments",
                        principalColumn: "CommentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Comments_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Comments_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "LessonId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Choices",
                columns: table => new
                {
                    ChoiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Answer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    QuizId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Choices", x => x.ChoiceId);
                    table.ForeignKey(
                        name: "FK_Choices_Quizs_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizs",
                        principalColumn: "QuizId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccountinCourses_AccountId",
                table: "AccountinCourses",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountinCourses_CourseId",
                table: "AccountinCourses",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountinLessons_AccountId",
                table: "AccountinLessons",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_AccountinLessons_LessonId",
                table: "AccountinLessons",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_Accounts_UserId",
                table: "Accounts",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Choices_QuizId",
                table: "Choices",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_AccountId",
                table: "Comments",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_CourseId",
                table: "Comments",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_LessonId",
                table: "Comments",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_ParentCommentId",
                table: "Comments",
                column: "ParentCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_AccountId",
                table: "Courses",
                column: "AccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_SubTopicId",
                table: "Lessons",
                column: "SubTopicId");

            migrationBuilder.CreateIndex(
                name: "IX_Quizs_SubTopicId",
                table: "Quizs",
                column: "SubTopicId");

            migrationBuilder.CreateIndex(
                name: "IX_SubTopics_TopicId",
                table: "SubTopics",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_Topics_CourseId",
                table: "Topics",
                column: "CourseId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccountinCourses");

            migrationBuilder.DropTable(
                name: "AccountinLessons");

            migrationBuilder.DropTable(
                name: "Choices");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "FAQs");

            migrationBuilder.DropTable(
                name: "Quizs");

            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "SubTopics");

            migrationBuilder.DropTable(
                name: "Topics");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Accounts");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
