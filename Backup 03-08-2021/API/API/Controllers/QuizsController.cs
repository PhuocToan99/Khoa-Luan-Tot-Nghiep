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
  public class QuizsController : ControllerBase
  {
    private readonly ApplicationDbContext _context;

    public QuizsController(ApplicationDbContext context)
    {
      _context = context;
    }

    // GET: api/GetQuizList
    [HttpGet]
    [Route("GetQuizList")]
    public async Task<ActionResult<IEnumerable<Quiz>>> GetQuizs()
    {
      return await _context.Quizs.ToListAsync();
    }

    // GET: api/GetQuiz5
    [HttpGet]
    [Route("GetQuiz{id}")]
    public async Task<ActionResult<Quiz>> GetQuiz(int id)
    {
      var quiz = await _context.Quizs.FindAsync(id);

      if (quiz == null)
      {
        return NotFound();
      }

      return quiz;
    }

    // PUT: api/EditQuiz5
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPut]
    [Route("EditQuiz{id}")]
    public async Task<IActionResult> PutQuiz(int id, [FromForm] Quiz quiz)
    {
      if (HttpContext.Request.Form.Files.Count > 0)
      {
        var file = HttpContext.Request.Form.Files[0];

        byte[] fileData = null;

        using (var binaryReader = new BinaryReader(file.OpenReadStream()))
        {
          fileData = binaryReader.ReadBytes((int)file.Length);
        }

        quiz.QuizImage = fileData;
      }
      if (id != quiz.QuizId)
      {
        return BadRequest();
      }

      _context.Entry(quiz).State = EntityState.Modified;

      try
      {
        if (!QuizExists(quiz.Question, quiz.QuestionpoolId, quiz.QuizId))
        {
          await _context.SaveChangesAsync();
        }
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!QuizExists(id))
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

    // POST: api/Quizs
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPost]
    [Route("AddQuiz")]
    public async Task<ActionResult<Quiz>> PostQuiz([FromForm] Quiz quiz)
    {
      if (HttpContext.Request.Form.Files.Count > 0)
      {
        var file = HttpContext.Request.Form.Files[0];

        byte[] fileData = null;

        using (var binaryReader = new BinaryReader(file.OpenReadStream()))
        {
          fileData = binaryReader.ReadBytes((int)file.Length);
        }

        quiz.QuizImage = fileData;
      }
      if (!QuizExists(quiz.Question, quiz.QuestionpoolId, quiz.QuizId))
      {
        _context.Quizs.Add(quiz);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetQuiz", new { id = quiz.QuizId }, quiz);
      }
      return null;
    }

    // DELETE: api/DeleteQuizs5
    [HttpDelete]
    [Route("DeleteQuizs{id}")]
    public async Task<ActionResult<Quiz>> DeleteQuiz(int id)
    {
      var quiz = await _context.Quizs.FindAsync(id);
      if (quiz == null)
      {
        return NotFound();
      }
      var choices = await _context.Choices.Where(c => c.QuizId == quiz.QuizId).ToListAsync();
      for (var i = 0; i < choices.Count(); i++)
      {
        _context.Choices.Remove(choices[i]);
        await _context.SaveChangesAsync();
      }
      _context.Quizs.Remove(quiz);
      await _context.SaveChangesAsync();

      return quiz;
    }

    private bool QuizExists(int id)
    {
      return _context.Quizs.Any(e => e.QuizId == id);
    }
    private bool QuizExists(string question, int id, int quizId)
    {
      return _context.Quizs.Any(e => e.Question == question && e.QuestionpoolId == id && e.QuizId != quizId);
    }
    // GET: api/LastQuiz
    [HttpGet]
    [Route("LastQuiz")]
    public async Task<ActionResult<Quiz>> GetLastQuiz()
    {
      return _context.Quizs.OrderByDescending(q => q.QuizId).FirstOrDefault();
    }
    [HttpGet]
    [Route("QuizCountInQuestionpool/{id}")]
    //api/Quizs/QuizCountInQuestionpool/1
    public async Task<ActionResult<IEnumerable<Quiz>>> GetQuizInQuestionpool(int id)
    {
      return await _context.Quizs.Where(q => q.QuestionpoolId == id).ToListAsync();
    }
    [HttpGet]
    [Route("QuizOfQuestionpoolCounts/{id}")]
    public async Task<ActionResult> GetNumOfQuiz(int id)
    {
      var list = await _context.Quizs.Where(q => q.QuestionpoolId == id).ToListAsync();
      return Content(list.Count.ToString());
    }
    public class QuizAndAnswer
    {
      public int QuizId { get; set; }
      public string Question { get; set; }
      public string QuestionType { get; set; }
      public Byte[] QuizImage { get; set; }
      public string QuizImageLink { get; set; }
      public string TopicId { get; set; }
      public int Time { get; set; }
      public string Description { get; set; }
      public int QuestionpoolId { get; set; }

      public ICollection<Choice> Choices { get; set; }
    }
    [HttpGet]
    [Route("QuizOfQuestionpool/{id}")]
    public ActionResult GetQuizsOfQuestionpool(int id)
    {
      List<Quiz> listquiz = _context.Quizs.Where(q => q.QuestionpoolId == id).ToList();
      List<Choice> listanswer = _context.Choices.ToList();
      var querry = from quiz in listquiz
                   join answer in listanswer on quiz.QuizId equals answer.QuizId
                   select new QuizAndAnswer
                   {
                     QuizId = quiz.QuizId,
                     Question = quiz.Question,
                     QuestionType = quiz.QuestionType,
                     QuizImage = quiz.QuizImage,
                     QuizImageLink = quiz.QuizImageLink,
                     TopicId = quiz.TopicId,
                     Time = quiz.Time,
                     QuestionpoolId = quiz.QuestionpoolId,
                     Choices = answer.Quiz.Choices
                   };
      if (querry != null)
      {
        return Ok(querry);
      }
      return NoContent();
    }
    public class QuizInfo
    {
      public int QuizID { get; set; }
      public string Question { get; set; }
      public string Answer1 { get; set; }
      public string Answer2 { get; set; }
      public string Answer3 { get; set; }
      public string Answer4 { get; set; }
      public string IsCorrect { get; set; }
    }
    [HttpGet]
    [Route("QuizOfInstructor")]
    public async Task<ActionResult<IEnumerable<QuizInfo>>> QuizOfInstructor(string id)
    {
      List<Questionpool> listQuestionpools = await _context.Questionpools.Where(e => e.AccountId == id).ToListAsync();
      List<QuizInfo> listQuizInfo = new List<QuizInfo>();
      if (listQuestionpools == null)
      {
        return listQuizInfo;
      }
      List<Quiz> listquiz = new List<Quiz>();
      List<Choice> listanswer = new List<Choice>();
      List<Quiz> listAllQuiz = await _context.Quizs.ToListAsync();
      List<Choice> listAllAnswer = await _context.Choices.ToListAsync();
      listQuestionpools.ForEach(e =>
      {
        var quizResult = listAllQuiz.Where(quiz => quiz.QuestionpoolId == e.QuestionpoolId).ToList();
        if (quizResult != null)
        {
          quizResult.ForEach(quizresult =>
          {
            var choiceresult = listAllAnswer.Where(answer => answer.QuizId == quizresult.QuizId).ToList();
            var quizInfo = new QuizInfo();
            quizInfo.QuizID = quizresult.QuizId;
            quizInfo.Question = quizresult.Question;
            quizInfo.Answer1 = choiceresult[0].Answer;
            quizInfo.Answer2 = choiceresult[1].Answer;
            quizInfo.Answer3 = choiceresult[2].Answer;
            quizInfo.Answer4 = choiceresult[3].Answer;
            if (choiceresult[0].IsCorrect == true)
            {
              quizInfo.IsCorrect = choiceresult[0].Answer;
            }
            if (choiceresult[1].IsCorrect == true)
            {
              quizInfo.IsCorrect = choiceresult[1].Answer;
            }
            if (choiceresult[2].IsCorrect == true)
            {
              quizInfo.IsCorrect = choiceresult[2].Answer;
            }
            if (choiceresult[3].IsCorrect == true)
            {
              quizInfo.IsCorrect = choiceresult[3].Answer;
            }
            listQuizInfo.Add(quizInfo);
          });
        }
      });
      return listQuizInfo;
    }
    public class VideoQuizInfo
    {
      public string QuizID { get; set; }
      public string Question { get; set; }
      public string Answer1 { get; set; }
      public string Answer2 { get; set; }
      public string Answer3 { get; set; }
      public string Answer4 { get; set; }
      public string Time { get; set; }
      public string IsCorrect { get; set; }
    }
    [HttpGet]
    [Route("GetVideoQuizList")]
    public async Task<ActionResult<IEnumerable<VideoQuizInfo>>> GetVideoQuizList(int id)
    {
      var lesson = await _context.Lessons.FindAsync(id);
      Console.WriteLine(lesson.LessonId+" "+lesson.QuizId+" "+lesson.VideoQuizTime);
      List<VideoQuizInfo> listQuizInfo = new List<VideoQuizInfo>();
      if (lesson.QuizId == null || lesson.QuizId == "" || lesson.VideoQuizTime == null || lesson.VideoQuizTime == "")
      {
        return listQuizInfo;
      }
      string[] quizIdList = lesson.QuizId.Split(" ");
      string[] timeList = lesson.VideoQuizTime.Split(" ");
      List<Quiz> listAllQuiz = await _context.Quizs.ToListAsync();
      List<Choice> listAllAnswer = await _context.Choices.ToListAsync();
      for (int i = 0;i< quizIdList.Length; i++)
      {
        var quizResult = listAllQuiz.Where(quiz => quiz.QuizId.ToString() == quizIdList[i]).ToList();
        if (quizResult != null)
        {
          quizResult.ForEach(quizresult =>
          {
            var choiceresult = listAllAnswer.Where(answer => answer.QuizId == quizresult.QuizId).ToList();
            var quizVideoInfo = new VideoQuizInfo();
            quizVideoInfo.Time = timeList[i];
            quizVideoInfo.QuizID = quizresult.QuizId.ToString();
            quizVideoInfo.Question = quizresult.Question;
            quizVideoInfo.Answer1 = choiceresult[0].Answer;
            quizVideoInfo.Answer2 = choiceresult[1].Answer;
            quizVideoInfo.Answer3 = choiceresult[2].Answer;
            quizVideoInfo.Answer4 = choiceresult[3].Answer;
            if (choiceresult[0].IsCorrect == true)
            {
              quizVideoInfo.IsCorrect = choiceresult[0].Answer;
            }
            if (choiceresult[1].IsCorrect == true)
            {
              quizVideoInfo.IsCorrect = choiceresult[1].Answer;
            }
            if (choiceresult[2].IsCorrect == true)
            {
              quizVideoInfo.IsCorrect = choiceresult[2].Answer;
            }
            if (choiceresult[3].IsCorrect == true)
            {
              quizVideoInfo.IsCorrect = choiceresult[3].Answer;
            }
            listQuizInfo.Add(quizVideoInfo);
          });
        }
      }
      return listQuizInfo;
    }
  }
}
