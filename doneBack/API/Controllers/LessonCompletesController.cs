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
    public class LessonCompletesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LessonCompletesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/GetLessonCompleteList
        [HttpGet]
        [Route("GetLessonCompleteList")]
        public async Task<ActionResult<IEnumerable<LessonComplete>>> GetLessonCompletes()
        {
            return await _context.LessonCompletes.ToListAsync();
        }

          // GET: api/GetLessonComplete5
         [HttpGet]
         [Route("GetLessonComplete{id}")]
         public async Task<ActionResult<LessonComplete>> GetLessonComplete(int id)
         {
            var lessonComplete = await _context.LessonCompletes.FindAsync(id);

            if (lessonComplete == null)
            {
                return NotFound();
            }

            return lessonComplete;
        }

            // PUT: api/EditLessonComplete5
            // To protect from overposting attacks, enable the specific properties you want to bind to, for
            // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
            [HttpPut]
            [Route("EditLessonComplete{id}")]
            public async Task<IActionResult> PutLessonComplete(int id, LessonComplete lessonComplete)
            {
            if (id != lessonComplete.LessonCompleteId)
            {
                return BadRequest();
            }

            _context.Entry(lessonComplete).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LessonCompleteExists(id))
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

    // POST: api/AddLessonComplete
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPost]
    [Route("AddLessonComplete")]
    public async Task<ActionResult<LessonComplete>> PostLessonComplete(LessonComplete lessonComplete)
        {
            _context.LessonCompletes.Add(lessonComplete);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLessonComplete", new { id = lessonComplete.LessonCompleteId }, lessonComplete);
        }

    // DELETE: api/DeleteLessonComplete5
    [HttpDelete]
    [Route("DeleteLessonComplete{id}")]
    public async Task<ActionResult<LessonComplete>> DeleteLessonComplete(int id)
        {
            var lessonComplete = await _context.LessonCompletes.FindAsync(id);
            if (lessonComplete == null)
            {
                return NotFound();
            }

            _context.LessonCompletes.Remove(lessonComplete);
            await _context.SaveChangesAsync();

            return lessonComplete;
        }

        private bool LessonCompleteExists(int id)
        {
            return _context.LessonCompletes.Any(e => e.LessonCompleteId == id);
        }
    }
}
