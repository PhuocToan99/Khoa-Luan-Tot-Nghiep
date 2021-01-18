using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
  public class FAQ
  {
    [Key]
    public int FAQId { get; set; }
    public string FAQQuestion { get; set; }
    public string FAQAnswer { get; set; }
  }
}
