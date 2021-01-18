using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
  public class ApplicationDbContext : DbContext
  {
    public ApplicationDbContext() { }
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }
    public DbSet<Account> Accounts { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Choice> Choices { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<FAQ> FAQs { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Quiz> Quizs { get; set; }
    public DbSet<SubTopic> SubTopics { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<AccountinCourse> AccountinCourses { get; set; }
    public DbSet<AccountinLesson> AccountinLessons { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Account>(entity =>
      {
        entity.Property(e => e.AccountId).UseIdentityColumn();
        //entity.HasOne(a => a.User).WithOne(u => u.Account).HasForeignKey<User>(u => u.AccountId).OnDelete(DeleteBehavior.Cascade);
      });
      modelBuilder.Entity<AccountinCourse>(entity =>
      {
        entity.Property(e => e.AccountinCourseID).UseIdentityColumn();
        entity.HasOne(e => e.Account).WithMany(d => d.AccountinCourse).HasForeignKey(d => d.AccountId).OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(e => e.Course).WithMany(d => d.UserinCourse).HasForeignKey(d => d.CourseId).OnDelete(DeleteBehavior.Restrict);
      });
      modelBuilder.Entity<AccountinLesson>(entity =>
      {
        entity.Property(e => e.AccountinLessonID).UseIdentityColumn();
        entity.HasOne(e => e.Account).WithMany(d => d.AccountinLesson).HasForeignKey(d => d.AccountId).OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(e => e.Lesson).WithMany(d => d.UserinLesson).HasForeignKey(d => d.LessonId).OnDelete(DeleteBehavior.Restrict);
      });
      modelBuilder.Entity<FAQ>(entity =>
      {
        entity.Property(e => e.FAQId).UseIdentityColumn();
      });
      modelBuilder.Entity<User>(entity =>
      {
        entity.Property(e => e.UserId).UseIdentityColumn();
        entity.HasOne(a => a.Account).WithOne(u => u.User).HasForeignKey<Account>(u => u.UserId).OnDelete(DeleteBehavior.Cascade);
      });
      modelBuilder.Entity<Choice>(entity =>
      {
        entity.Property(e => e.ChoiceId).UseIdentityColumn();
        entity.HasOne(a => a.Quiz).WithMany(u => u.Choices).HasForeignKey(a => a.QuizId).OnDelete(DeleteBehavior.Restrict);
      });
      modelBuilder.Entity<Comment>(entity =>
      {
        entity.Property(e => e.CommentId).UseIdentityColumn();
        entity.HasOne(a => a.Account).WithMany(u => u.Comments).HasForeignKey(a => a.AccountId).OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(a => a.Course).WithMany(u => u.Comments).HasForeignKey(a => a.CourseId).OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(a => a.Lesson).WithMany(u => u.Comments).HasForeignKey(a => a.LessonId).OnDelete(DeleteBehavior.Restrict);
        entity.HasOne(e => e.ParentComment).WithMany(d => d.ChildComments).HasForeignKey(d => d.ParentCommentId).OnDelete(DeleteBehavior.Restrict);
      });
      modelBuilder.Entity<Course>(entity =>
      {
        entity.Property(e => e.CourseId).UseIdentityColumn();
        entity.HasOne(a => a.Account).WithMany(u => u.Courses).HasForeignKey(a => a.AccountId).OnDelete(DeleteBehavior.Restrict);
      });
      modelBuilder.Entity<Lesson>(entity =>
      {
        entity.Property(e => e.LessonId).UseIdentityColumn();
        entity.HasOne(a => a.SubTopic).WithMany(u => u.Lessons).HasForeignKey(a => a.SubTopicId).OnDelete(DeleteBehavior.Restrict);
      });
      modelBuilder.Entity<Quiz>(entity =>
      {
        entity.Property(e => e.QuizId).UseIdentityColumn();
        entity.HasOne(a => a.Lesson).WithMany(u => u.Quizs).HasForeignKey(a => a.LessonId).OnDelete(DeleteBehavior.Restrict);
      });
      modelBuilder.Entity<SubTopic>(entity =>
      {
        entity.Property(e => e.SubTopicId).UseIdentityColumn();
        entity.HasOne(a => a.Topic).WithMany(u => u.SubTopics).HasForeignKey(a => a.TopicId).OnDelete(DeleteBehavior.Restrict);
      });
      modelBuilder.Entity<Topic>(entity =>
      {
        entity.Property(e => e.TopicId).UseIdentityColumn();
        entity.HasOne(a => a.Course).WithMany(u => u.Topics).HasForeignKey(a => a.CourseId).OnDelete(DeleteBehavior.Restrict);
      });
    }
  }
}
