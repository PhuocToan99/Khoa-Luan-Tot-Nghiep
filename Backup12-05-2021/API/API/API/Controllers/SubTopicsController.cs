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
    public class SubTopicsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubTopicsController(ApplicationDbContext context)
        {
            _context = context;
        }

    // GET: api/GetSubtopicList
    [HttpGet]
        [Route("GetSubtopicList")]
    public async Task<ActionResult<IEnumerable<SubTopic>>> GetSubTopics()
        {
            return await _context.SubTopics.ToListAsync();
        }
    [HttpGet]
    [Route("SubtopicCounts/{id}")]
    public async Task<ActionResult> GetNumOfSubTopic(int id)
    {
      var list = await _context.SubTopics.Where(c => c.TopicId == id).ToListAsync();
      return Content(list.Count.ToString());
    }
    // GET: api/GetSubtopic1
    [HttpGet]
    [Route("GetSubtopic{id}")]
    public async Task<ActionResult<SubTopic>> GetSubTopic(int id)
        {
            var subTopic = await _context.SubTopics.FindAsync(id);

            if (subTopic == null)
            {
                return NotFound();
            }

            return subTopic;
        }

    // PUT: api/EditSubtopic1
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPut]
        [Route("EditSubtopic{id}")]
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

    // POST: api/AddSubtopic
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPost]
        [Route("AddSubtopic")]
    public async Task<ActionResult<SubTopic>> PostSubTopic(SubTopic subTopic)
        {
            _context.SubTopics.Add(subTopic);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubTopic", new { id = subTopic.SubTopicId }, subTopic);
        }

    // DELETE: api/DeleteSubtopic1
    [HttpDelete]
        [Route("DeleteSubtopic{id}")]
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
    // GET: api/GetSubtopicByTopic/1
    [HttpGet]
    [Route("GetSubtopicByTopic/{id}")]
    public async Task<ActionResult<IEnumerable<SubTopic>>> GetSubTopicByTopicId(int id)
    {
      return await _context.SubTopics.Where(c => c.TopicId == id).ToListAsync();
    }
    [HttpGet]
    [Route("GetSubtopic/{id}")]
    //https://localhost:44387/api/GetSubtopic/3
    public async Task<ActionResult<IEnumerable<SubTopic>>> GetSubtopicByCourseID(int id)
    {
      var list = await _context.Topics.Where(c => c.CourseId == id).ToListAsync();
      var list1 = await _context.SubTopics.ToListAsync();
      List<SubTopic> result = new List<SubTopic>();
      int length = list.Count(), length1 = list1.Count();
      for (int i = 0; i < length; i++)
      {
        for (int j = 0; j < length1; j++)
        {
          if (list1[j].TopicId == list[i].TopicId)
          {
            result.Add(list1[j]);
          }
        }
      }
      return result;
    }
  }
}
