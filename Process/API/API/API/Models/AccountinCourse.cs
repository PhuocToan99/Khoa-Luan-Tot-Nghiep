using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
  public class AccountinCourse
  {
    [Key]
    public int AccountinCourseID { get; set; }
    public Account Account { get; set; }
    [Required]
    public int AccountId { get; set; }
    public Course Course { get; set; }
    [Required]
    public int CourseId { get; set; }
  }
}
