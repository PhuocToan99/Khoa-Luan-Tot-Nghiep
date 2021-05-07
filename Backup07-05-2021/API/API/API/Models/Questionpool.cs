using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
  public class Questionpool
  {
    [Key]
    public int QuestionpoolId { get; set; }
    public string QuestionpoolName { get; set; }
    //public string Question { get; set; }
    //public int Point { get; set; }
    //public int Time { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime LastEdited { get; set; }
    public string Hastag { get; set; }
    public Byte[] ThumbnailImage { get; set; }
    public string ThumbnailImageURL { get; set; }
    public Boolean IsActive { get; set; }
    //public string QuizCode { get; set; }
    public string Level { get; set; }
    public string ShareMethod { get; set; }
    public Lesson Lesson { get; set; }
    public int LessonId { get; set; }
    public Course Course { get; set; }
    [Required]
    public int CourseId { get; set; }
    public ICollection<Quiz> Quizs { get; set; }
  }
}
