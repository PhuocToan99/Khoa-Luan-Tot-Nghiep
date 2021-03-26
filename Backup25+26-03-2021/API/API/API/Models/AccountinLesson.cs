using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
  public class AccountinLesson
  {
    [Key]
    public int AccountinLessonID { get; set; }
    public Account Account { get; set; }
    [Required]
    public int AccountId { get; set; }
    public Lesson Lesson { get; set; }
    //public int LessonComplete { get; set; }
    public Boolean IsCompleted { get; set; }
    [Required]
    public int LessonId { get; set; }
    public int Point { get; set; }
    public DateTime LastTaken { get; set; }
  }
}
