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
    public string Question { get; set; }
    public int Point { get; set; }
    public int Time { get; set; }
    public Lesson Lesson { get; set; }
    [Required]
    public int LessonId { get; set; }
    public ICollection<Choice> Choices { get; set; }
  }
}
