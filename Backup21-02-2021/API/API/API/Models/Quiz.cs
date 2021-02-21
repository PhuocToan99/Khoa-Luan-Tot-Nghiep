using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
  public class Quiz
  {
    [Key]
    public int QuizId { get; set; }
    public string QuizName { get; set; }
    //public string Question { get; set; }
    //public int Point { get; set; }
    //public int Time { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime LastEdited { get; set; }
    public string Hastag { get; set; }
    public Byte[] ThumbnailImage { get; set; }
    public string QuizCode { get; set; }
    public Lesson Lesson { get; set; }
    [Required]
    public int LessonId { get; set; }
    public ICollection<Questionpool> Questionpools { get; set; }
  }
}
