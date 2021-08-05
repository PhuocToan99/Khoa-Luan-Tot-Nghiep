using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;

namespace API.Controllers
{
    [Route("api")]
    [ApiController]
    public class CertificatesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CertificatesController(ApplicationDbContext context)
        {
            _context = context;
        }

    // GET: api/GetCertificateList
    [HttpGet]
    [Route("GetCertificateList")]
    public async Task<ActionResult<IEnumerable<Certificate>>> GetCertificates()
        {
            return await _context.Certificates.ToListAsync();
        }

    // GET: api/GetCertificate5
    [HttpGet]
    [Route("GetCertificate{id}")]
    public async Task<ActionResult<Certificate>> GetCertificate(int id)
        {
            var certificate = await _context.Certificates.FindAsync(id);

            if (certificate == null)
            {
                return NotFound();
            }

            return certificate;
        }

    // PUT: api/EditCertificate5
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPut("{id}")]
    [Route("EditCertificate{id}")]
    public async Task<IActionResult> PutCertificate(int id, Certificate certificate)
        {
            if (id != certificate.CertificateId)
            {
                return BadRequest();
            }

            _context.Entry(certificate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CertificateExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

    // POST: api/AddCertificate
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPost]
    [Route("AddCertificate")]
    public async Task<ActionResult<Certificate>> PostCertificate(Certificate certificate)
        {
      if (CertificateCheckExists(certificate.AccountId, certificate.CourseId) != true)
      {
        _context.Certificates.Add(certificate);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetCertificate", new { id = certificate.CertificateId }, certificate);
      }
      return null;
        }

    // DELETE: api/DeleteCertificate5
    [HttpDelete]
    [Route("DeleteCertificate{id}")]
    public async Task<ActionResult<Certificate>> DeleteCertificate(int id)
    {
            var certificate = await _context.Certificates.FindAsync(id);
            if (certificate == null)
            {
                return NotFound();
            }

            _context.Certificates.Remove(certificate);
            await _context.SaveChangesAsync();

            return certificate;
    }

        private bool CertificateExists(int id)
        {
            return _context.Certificates.Any(e => e.CertificateId == id);
        }
    public class ProcessData
    {
      public int TotalElement { get; set; }
      public double Rate { get; set; }
    }
    [HttpGet]
    [Route("GetProcessData")]
    public async Task<ActionResult<ProcessData>> GetProcessData(int courseId, string accountId)
    {
      var processData = new ProcessData();
      var course = await _context.Courses.FindAsync(courseId);
      processData.TotalElement += course.LessonNumber;
      var accountInLessonData = await _context.AccountinLessons.Where(e => e.AccountId == accountId && e.IsCompleted == true).ToListAsync();
      int userProcess = 0;
      var examQuizList = await _context.ExamQuizs.Where(e => e.CourseId == courseId.ToString()).ToListAsync();
      processData.TotalElement += examQuizList.Count();
      var lessonComplete = await _context.LessonCompletes.Where(e => e.AccountId == accountId && e.CourseId == courseId.ToString()).ToListAsync();
      userProcess += lessonComplete.Count();
      if(accountInLessonData.Count() > 0)
      {
        string quizCode = accountInLessonData[0].ExamQuizCode;
        userProcess += 1;
        for(int i = 0; i< accountInLessonData.Count();i++)
        {
          if(accountInLessonData[i].ExamQuizCode != quizCode)
          {
            userProcess += 1;
            quizCode = accountInLessonData[i].ExamQuizCode;
          }
        }
      }
      processData.Rate = (userProcess * 100.00) / processData.TotalElement;
      return processData;
    }
    private Boolean CertificateCheckExists(string accountId, string courseId)
    {
      return _context.Certificates.Any(e => e.AccountId == accountId && e.CourseId == courseId);
    }
    [HttpGet]
    [Route("GetCertificateByCourseAccountId")]
    public async Task<ActionResult<IEnumerable<Certificate>>> GetCertificateByCourseAccountId(string accountId,string courseId)
    {
      return await _context.Certificates.Where(e => e.AccountId == accountId && e.CourseId == courseId).ToListAsync();
    }
    [HttpGet]
    [Route("GetLastestCertificateByAccountId")]
    public async Task<ActionResult<IEnumerable<Certificate>>> GetLastestCertificateByAccountId(string accountId)
    {
      return await _context.Certificates.Where(e => e.AccountId == accountId)
      .OrderByDescending(e => e.CertificateId)
      .Take(1)
      .ToListAsync();
    }
    public class FullCertificateInfo
    {
      public Course Course { get; set; }
      public string UserName { get; set; }
      public Byte[] AvatarPath { get; set; }
      public string GetDate { get; set; }
    }
    [HttpGet]
    [Route("GetAllCertificateByAccountId")]
    public async Task<ActionResult<IEnumerable<FullCertificateInfo>>> GetAllCertificateByAccountId(string accountId)
    {
      var result = await _context.Certificates.Where(e => e.AccountId == accountId)
      .OrderByDescending(e => e.CertificateId)
      .ToListAsync();
      var account = await _context.Accounts.FindAsync(int.Parse(accountId));
      var userInfo = await _context.Users.Where(e => e.UserId == account.UserId).ToListAsync();
      var courseList = await _context.Courses.ToListAsync();
      List<FullCertificateInfo> fullCertificateInfo = new List<FullCertificateInfo>();
      if (result.Count() > 0)
      {
        result.ForEach(e =>
        {
          var fullCertificateElement = new FullCertificateInfo();
          fullCertificateElement.Course = new Course();
          var courseInfo = courseList.Find(course => course.CourseId.ToString() == e.CourseId);
          fullCertificateElement.Course = courseInfo;
          fullCertificateElement.UserName = userInfo[0].FirstName + " " + userInfo[0].LastName;
          fullCertificateElement.AvatarPath = userInfo[0].AvatarPath;
          fullCertificateElement.GetDate = e.GetDate.ToString("dd/MM/yyyy");
          fullCertificateInfo.Add(fullCertificateElement);
        });
      }
      return fullCertificateInfo;
    }
  }

}
