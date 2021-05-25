using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
  public class SubComment
  {
    [Key]
    public int SubCommentId { get; set; }
    public string SubCommentContent { get; set; }
    public int SubRating { get; set; }
    public DateTime SubDatePost { get; set; }
    public Boolean IsLiked { get; set; }
    public Comment ParentComment { get; set; }
    public int? ParentCommentId { get; set; }
  }
}
