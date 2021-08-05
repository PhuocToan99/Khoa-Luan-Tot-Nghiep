using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
  public class Certificate
  {
    public int CertificateId { get; set; }
    public string CourseId { get; set; }
    public string AccountId { get; set; }
    public DateTime GetDate { get; set; }
  }
}
