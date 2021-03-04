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
    public int QuestionId { get; set; }
    public string Question { get; set; }
    public string QuestionType { get; set; }
    public Byte[] Image { get; set; }
    public Topic Topic { get; set; }
    [Required]
    public int TopicId { get; set; }
    public int Time { get; set; }
    public string Description { get; set; }
    //public string QuizCode { get; set; }
    //public string QuestionCode { get; set; }
    public Quiz Quiz { get; set; }
    [Required]
    public int QuizId { get; set; }
    public ICollection<Choice> Choices { get; set; }
  }
}
