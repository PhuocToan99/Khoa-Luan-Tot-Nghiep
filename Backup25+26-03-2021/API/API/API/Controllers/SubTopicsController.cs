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
    public class SubTopicsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubTopicsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/SubTopics
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubTopic>>> GetSubTopics()
        {
            return await _context.SubTopics.ToListAsync();
        }
    [HttpGet]
    [Route("Counts/{id}")]
    public async Task<ActionResult> GetNumOfSubTopic(int id)
    {
      var list = await _context.SubTopics.Where(c => c.TopicId == id).ToListAsync();
      return Content(list.Count.ToString());
    }
    // GET: api/SubTopics/5
    [HttpGet("{id}")]
        public async Task<ActionResult<SubTopic>> GetSubTopic(int id)
        {
            var subTopic = await _context.SubTopics.FindAsync(id);

            if (subTopic == null)
            {
                return NotFound();
            }

            return subTopic;
        }

        // PUT: api/SubTopics/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubTopic(int id, SubTopic subTopic)
        {
            if (id != subTopic.SubTopicId)
            {
                return BadRequest();
            }

            _context.Entry(subTopic).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubTopicExists(id))
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

        // POST: api/SubTopics
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<SubTopic>> PostSubTopic(SubTopic subTopic)
        {
            _context.SubTopics.Add(subTopic);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubTopic", new { id = subTopic.SubTopicId }, subTopic);
        }

        // DELETE: api/SubTopics/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SubTopic>> DeleteSubTopic(int id)
        {
            var subTopic = await _context.SubTopics.FindAsync(id);
            if (subTopic == null)
            {
                return NotFound();
            }

            _context.SubTopics.Remove(subTopic);
            await _context.SaveChangesAsync();

            return subTopic;
        }

        private bool SubTopicExists(int id)
        {
            return _context.SubTopics.Any(e => e.SubTopicId == id);
        }
    }
}
