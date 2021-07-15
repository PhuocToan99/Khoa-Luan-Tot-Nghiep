using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using System.IO;

namespace API.Controllers
{
  [Route("api")]
  [ApiController]
  public class QuestionpoolsController : ControllerBase
  {
    private readonly ApplicationDbContext _context;

    public QuestionpoolsController(ApplicationDbContext context)
    {
      _context = context;
    }

    // GET: api/GetQuestionpoolList
    [HttpGet]
    [Route("GetQuestionpoolList")]
    public async Task<ActionResult<IEnumerable<Questionpool>>> GetQuestionpools()
    {
      return await _context.Questionpools.ToListAsync();
    }

    // GET: api/GetQuestonpool{id}
    [HttpGet]
    [Route("GetQuestonpool{id}")]
    public async Task<ActionResult<Questionpool>> GetQuestionpool(int id)
    {
      var questionpool = await _context.Questionpools.FindAsync(id);

      if (questionpool == null)
      {
        return NotFound();
      }

      return questionpool;
    }

    // PUT: api/"EditQuestionpool1"
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPut]
    [Route("EditQuestionpool{id}")]
    public async Task<IActionResult> PutQuestionpool(int id, [FromForm] Questionpool questionpool)
    {
      if (HttpContext.Request.Form.Files.Count > 0)
      {
        var file = HttpContext.Request.Form.Files[0];

        byte[] fileData = null;

        using (var binaryReader = new BinaryReader(file.OpenReadStream()))
        {
          fileData = binaryReader.ReadBytes((int)file.Length);
        }

        questionpool.QuestionpoolThumbnailImage = fileData;
      }
      if (id != questionpool.QuestionpoolId)
      {
        return BadRequest();
      }

      _context.Entry(questionpool).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!QuestionpoolExists(id))
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

    // POST: api/Questionpools
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPost]
    [Route("AddQuestionpool")]
    public async Task<ActionResult<Questionpool>> PostQuestionpool([FromForm] Questionpool questionpool)
    {
      if (!QuestionpoolExists(questionpool.QuestionpoolName))
      {
        if (HttpContext.Request.Form.Files.Count > 0)
        {
          var file = HttpContext.Request.Form.Files[0];

          byte[] fileData = null;

          using (var binaryReader = new BinaryReader(file.OpenReadStream()))
          {
            fileData = binaryReader.ReadBytes((int)file.Length);
          }

          questionpool.QuestionpoolThumbnailImage = fileData;
        }
        _context.Questionpools.Add(questionpool);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetQuestionpool", new { id = questionpool.QuestionpoolId }, questionpool);
      }
      return null;
    }

    // DELETE: api/DeleteAccountinLesson1
    [HttpDelete]
    [Route("DeleteQuestionpool{id}")]
    public async Task<ActionResult<Questionpool>> DeleteQuestionpool(int id)
    {
      var questionpool = await _context.Questionpools.FindAsync(id);
      if (questionpool == null)
      {
        return NotFound();
      }
      var quizList = await _context.Quizs.Where(e => e.QuestionpoolId == id).ToListAsync();
      if(quizList != null)
      {
        List<Choice> choiceList = new List<Choice>();
        List<Choice> tempChoiceList = new List<Choice>();
        quizList.ForEach(e =>
        {
          tempChoiceList = _context.Choices.Where(c => c.QuizId == e.QuizId).ToList();
          choiceList.AddRange(tempChoiceList);
        });
        choiceList.ForEach(e => _context.Choices.Remove(e));
        quizList.ForEach(e => _context.Quizs.Remove(e));
      }
      _context.Questionpools.Remove(questionpool);
      await _context.SaveChangesAsync();

      return questionpool;
    }

    private bool QuestionpoolExists(int id)
    {
      return _context.Questionpools.Any(e => e.QuestionpoolId == id);
    }
    private bool QuestionpoolExists(string questionpoolName)
    {
      return _context.Questionpools.Any(e => e.QuestionpoolName == questionpoolName);
    }
    // GET: api/getInstructor/1
    [HttpGet("getInstructor/{id}")]
    public async Task<ActionResult<User>> GetInstructor(int id)
    {
      var result = await _context.Courses.Where(c => c.CourseId == id).FirstAsync();
      var account = await _context.Accounts.Where(a => a.AccountId == result.AccountId).FirstAsync();
      var user = await _context.Users.Where(u => account.UserId == u.UserId).FirstAsync();
      return user;
    }
    [HttpGet("GetQuestionpool")]
    public async Task<ActionResult<IEnumerable<Questionpool>>> GetListQuestionpoolByIds(string accountId)
    {
      return await _context.Questionpools.Where(qp => qp.AccountId == accountId)
        .OrderByDescending(qp => qp.IsActive)
        .ThenByDescending(qp => qp.QuestionpoolId)
        .ToListAsync();
    }
    [HttpGet]
    [Route("CountQuizOfQuestionpools/{id}")]
    public async Task<ActionResult> GetNumOfQuiz(int id)
    {
      var list = await _context.Quizs.Where(c => c.QuestionpoolId == id).ToListAsync();
      return Content(list.Count.ToString());
    }
    [HttpPut]
    [Route("DeActiveQuestionpool")]
    public async Task<ActionResult> DeActiveQuestionpool(int id)
    {
      var result = await _context.Questionpools.FindAsync(id);
      result.IsActive = !result.IsActive;
      _context.SaveChanges();
      return NoContent();
    }
    // GET: api/GetListActiveQuestionpool
    [HttpGet]
    [Route("GetListActiveQuestionpool")]
    public async Task<ActionResult<IEnumerable<Questionpool>>> GetListActiveQuestionpool(string accountId)
    {
      return await _context.Questionpools.Where(e => e.IsActive == true && e.AccountId == accountId).OrderByDescending(e => e.QuestionpoolId)
      .ToListAsync();
    }
    [HttpGet]
    [Route("FilterQuestionpool")]
    public async Task<ActionResult<IEnumerable<Questionpool>>> FilterQuestionpool(int createdDate = 0,int hastag = -1, string questionpoolName=null,string accountId = null)
    {
      List<string> hastags = new List<string>(new string[] { "C", "C#", "C++", "Java", "Html/css", "Python", "IOS/Android", "AI", "Javascript", "Machine Learning", "UX/UI", "Framework", "Orther" });
      if (createdDate != 0)
      {
        var result = (createdDate == 1) ? await _context.Questionpools.Where(e => e.AccountId == accountId && (hastag == -1 || e.Hastag == hastags[hastag]) && (questionpoolName == null || e.QuestionpoolName.ToLower().Contains(questionpoolName.ToLower())))
        .OrderByDescending(e => e.QuestionpoolId)
        .ToListAsync()
        :
        await _context.Questionpools.Where(e => e.AccountId == accountId && (hastag == -1 || e.Hastag == hastags[hastag]) && (questionpoolName == null || e.QuestionpoolName.ToLower().Contains(questionpoolName.ToLower())))
        .OrderBy(e => e.QuestionpoolId)
        .ToListAsync();
        return result;
      }
      return await _context.Questionpools.Where(e => e.AccountId == accountId && (hastag == -1 || e.Hastag == hastags[hastag]) && (questionpoolName == null || e.QuestionpoolName.ToLower().Contains(questionpoolName.ToLower())))
       .OrderByDescending(e => e.QuestionpoolId)
       .ToListAsync();
    }
    }
  }

