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
    public class ExamQuizsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExamQuizsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/GetExamQuizList
        [HttpGet]
        [Route("GetExamQuizList")]
        public async Task<ActionResult<IEnumerable<ExamQuiz>>> GetExamQuizs()
        {
            return await _context.ExamQuizs.ToListAsync();
        }

        // GET: api/GetExamQuiz1
        [HttpGet]
        [Route("GetExamQuiz{id}")]
        public async Task<ActionResult<ExamQuiz>> GetExamQuiz(int id)
        {
            var examQuiz = await _context.ExamQuizs.FindAsync(id);

            if (examQuiz == null)
            {
                return NotFound();
            }

            return examQuiz;
        }

        // PUT: api/ExamQuizs/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut]
        [Route("EditExamQuiz{id}")]
        public async Task<IActionResult> PutExamQuiz(int id, ExamQuiz examQuiz)
        {
            if (id != examQuiz.ExamQuizId)
            {
                return BadRequest();
            }

            _context.Entry(examQuiz).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExamQuizExists(id))
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

        // POST: api/ExamQuizs
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.

        [HttpPost]
        [Route("AddExamQuiz")]
        public async Task<ActionResult<ExamQuiz>> PostExamQuiz(ExamQuiz examQuiz)
        {
            if (ExamQuizCheckExists(examQuiz.QuizId, examQuiz.ExamQuizCode) != true)
            {
                _context.ExamQuizs.Add(examQuiz);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetExamQuiz", new { id = examQuiz.ExamQuizId }, examQuiz);
            }
            return null;
        }
        // DELETE: api/ExamQuizs/5
        [HttpDelete]
        [Route("DeleteExamQuizs{id}")]
        public async Task<ActionResult<ExamQuiz>> DeleteExamQuiz(int id)
        {
            var examQuiz = await _context.ExamQuizs.FindAsync(id);
            if (examQuiz == null)
            {
                return NotFound();
            }

            _context.ExamQuizs.Remove(examQuiz);
            await _context.SaveChangesAsync();

            return examQuiz;
        }

        private bool ExamQuizExists(int id)
        {
            return _context.ExamQuizs.Any(e => e.ExamQuizId == id);
        }
        private bool ExamQuizQuestionExists(string question)
        {
            return _context.ExamQuizs.Any(e => e.ExamQuestion == question);
        }
        private bool ExamQuizQuizIdExists(string id)
        {
            return _context.ExamQuizs.Any(e => e.QuizId == id);
        }
        [HttpGet]
        [Route("GetExamQuizListOrderByExamCode")]
        public async Task<ActionResult<IEnumerable<ExamQuiz>>> GetExamQuizsOrderbyExamCode(string id)
        {
            return await _context.ExamQuizs.Where(e => e.CourseId == id)
              .OrderBy(e => e.ExamQuizCode)
              .ThenBy(e => e.ExamQuizId)
              .ToListAsync();
        }
        [HttpGet]
        [Route("GetExamQuizListByExamCode")]
        public async Task<ActionResult<IEnumerable<ExamQuiz>>> GetExamQuizListByExamCode(string examcode)
        {
            return await _context.ExamQuizs.Where(e => e.ExamQuizCode == examcode)
              .OrderByDescending(e => e.ExamQuizId)
              .ToListAsync();
        }
        [HttpPut]
        [Route("ChangeExamquizState")]
        public async Task<IActionResult> ChangeExamquizState(string examQuizCode)
        {
          var examQuizList = await _context.ExamQuizs.Where(e => e.ExamQuizCode == examQuizCode).ToListAsync();
          examQuizList.ForEach(e =>
          {
            e.IsBlocked = !e.IsBlocked;
          });
          await _context.SaveChangesAsync();
          return NoContent();
        }
        private bool ExamQuizCheckExists(string id, string examCode)
        {
            return _context.ExamQuizs.Any(e => e.QuizId == id && e.ExamQuizCode == examCode);
        }
        public class ExamQuizMobile
        {
          public string question { get; set; }
          public string optionA { get; set; }
          public string optionB { get; set; }
          public string optionC { get; set; }
          public string optionD { get; set; }
          public string answer { get; set; }
        }
        [HttpGet]
        [Route("GetExamQuizListByExamCodeMobile")]
        public async Task<ActionResult<IEnumerable<ExamQuizMobile>>> GetExamQuizListByExamCodeMobile(string examcode)
        {
          var list = await _context.ExamQuizs.Where(e => e.ExamQuizCode == examcode)
          .OrderByDescending(e => e.ExamQuizId)
          .ToListAsync();
          var examQuizMobile = new ExamQuizMobile();
          List<ExamQuizMobile> result = new List<ExamQuizMobile>();
          list.ForEach(e =>
          {
            examQuizMobile.question = e.ExamQuestion;
            examQuizMobile.optionA = e.ExamOption1;
            examQuizMobile.optionB = e.ExamOption2;
            examQuizMobile.optionC = e.ExamOption3;
            examQuizMobile.optionD = e.ExamOption4;
            switch (e.ExamIsCorrect)
            {
              case "1":
                examQuizMobile.answer = e.ExamOption1;
                break;
              case "2":
                examQuizMobile.answer = e.ExamOption2;
                break;
              case "3":
                examQuizMobile.answer = e.ExamOption3;
                break;
              case "4":
                examQuizMobile.answer = e.ExamOption4;
                break;
            }
            result.Add(examQuizMobile);
          });
          return result;
        }
    public class ExamQuizInfoMobile
    {
      public int examQuizId { get; set; }
      public string examQuizName { get; set; }
      public string examQuizCode { get; set; }
    }
    [HttpGet]
    [Route("GetExamQuizInfoMobile")]
    public async Task<ActionResult<IEnumerable<ExamQuizInfoMobile>>> GetExamQuizInfoMobile(string courseId)
    {
      List<ExamQuizInfoMobile> examQuizInfoMobile = new List<ExamQuizInfoMobile>();
      var examQuizInfo = new ExamQuizInfoMobile();
      int examQuizId = 1;
      int count = 1;
      string examQuizName = "";
      string examQuizCode = "";
      var result = await _context.ExamQuizs.Where(e => e.CourseId == courseId).ToListAsync();
      if (result != null)
      {
        for (int i = 0; i < result.Count(); i++)
        {
          if (i == 0)
          {
            examQuizInfo = new ExamQuizInfoMobile();
            examQuizName = (result[0].ExamQuizName != null) ? result[0].ExamQuizName : "Exam " + count;
            examQuizCode = result[0].ExamQuizCode;
            examQuizInfo.examQuizCode = examQuizCode;
            examQuizInfo.examQuizName = examQuizName;
            examQuizInfo.examQuizId = examQuizId;
            examQuizInfoMobile.Add(examQuizInfo);
          }
          if(result[i].ExamQuizCode != examQuizCode)
          {
            examQuizInfo = new ExamQuizInfoMobile();
            if (result[i].ExamQuizName == null && result[i].ExamQuizCode != examQuizCode)
            {
              count++;
            }
            examQuizCode = result[i].ExamQuizCode;
              examQuizId++;
              examQuizInfo.examQuizName = (result[i].ExamQuizName != null) ? result[i].ExamQuizName : "Exam " + count;
              examQuizInfo.examQuizCode = result[i].ExamQuizCode;
              examQuizInfo.examQuizId = examQuizId;
              examQuizInfoMobile.Add(examQuizInfo);
          }
        }
        return examQuizInfoMobile;
      }
      return examQuizInfoMobile;
    }
    }
}
