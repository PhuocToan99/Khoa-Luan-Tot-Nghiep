using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
  public class Comment
  {
    [Key]
    public int CommentId { get; set; }
    public string CommentContent { get; set; }
    public int Rating { get; set; }
    public DateTime DatePost { get; set; }
    public Comment ParentComment { get; set; }
    public int? ParentCommentId { get; set; }
    public ICollection<Comment> ChildComments { get; set; }
    public Account Account { get; set; }
    [Required]
    public int AccountId { get; set; }
    public Course Course { get; set; }
    public int? CourseId { get; set; }
    public Lesson Lesson { get; set; }

    public int? LessonId { get; set; }
  }
}
