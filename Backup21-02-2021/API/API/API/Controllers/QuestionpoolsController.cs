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
    public class QuestionpoolsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuestionpoolsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Questionpools
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Questionpool>>> GetQuestionpools()
        {
            return await _context.Questionpools.ToListAsync();
        }

        // GET: api/Questionpools/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Questionpool>> GetQuestionpool(int id)
        {
            var questionpool = await _context.Questionpools.FindAsync(id);

            if (questionpool == null)
            {
                return NotFound();
            }

            return questionpool;
        }

        // PUT: api/Questionpools/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuestionpool(int id, Questionpool questionpool)
        {
            if (id != questionpool.QuestionId)
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
        public async Task<ActionResult<Questionpool>> PostQuestionpool(Questionpool questionpool)
        {
            _context.Questionpools.Add(questionpool);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuestionpool", new { id = questionpool.QuestionId }, questionpool);
        }

        // DELETE: api/Questionpools/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Questionpool>> DeleteQuestionpool(int id)
        {
            var questionpool = await _context.Questionpools.FindAsync(id);
            if (questionpool == null)
            {
                return NotFound();
            }

            _context.Questionpools.Remove(questionpool);
            await _context.SaveChangesAsync();

            return questionpool;
        }

        private bool QuestionpoolExists(int id)
        {
            return _context.Questionpools.Any(e => e.QuestionId == id);
        }
    }
}
