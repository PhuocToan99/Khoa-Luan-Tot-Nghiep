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
    [Route("api/[controller]")]
    [ApiController]
    public class ExamQuizsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExamQuizsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ExamQuizs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamQuiz>>> GetExamQuizs()
        {
            return await _context.ExamQuizs.ToListAsync();
        }

        // GET: api/ExamQuizs/5
        [HttpGet("{id}")]
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
        [HttpPut("{id}")]
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
        public async Task<ActionResult<ExamQuiz>> PostExamQuiz(ExamQuiz examQuiz)
        {
            _context.ExamQuizs.Add(examQuiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExamQuiz", new { id = examQuiz.ExamQuizId }, examQuiz);
        }

        // DELETE: api/ExamQuizs/5
        [HttpDelete("{id}")]
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
    }
}
