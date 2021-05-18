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
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CoursesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            return await _context.Courses.Where(a => a.IsActive == true).OrderByDescending(c => c.CourseId).ToListAsync();
        }
    // GET: api/Courses/All
    [HttpGet]
    [Route("All")]
    public async Task<ActionResult<IEnumerable<Course>>> GetCoursesAll()
    {
      return await _context.Courses.OrderByDescending(c => c.CourseId).ToListAsync();
    }

    // GET: api/Courses/5
    [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);

            if (course == null)
            {
                return NotFound();
            }

            return course;
        }
    [HttpGet]
    [Route("Top")]
    public async Task<ActionResult<IEnumerable<Course>>> GetTop5Certifications()
    {
      return await _context.Courses.Where(e => e.IsActive == true).OrderByDescending(e => e.CourseId).Take(6).ToListAsync();
    }
    // GET: api/Courses/GetCourse/name
    [HttpGet]
    [Route("GetCourse/{name}")]

    public async Task<ActionResult<IEnumerable<Course>>> GetCourseSearch(string name)
    {
      var course = await _context.Courses
          .Where((a => a.CourseName.ToLower().Contains(name.ToLower()))).ToListAsync();

      if (course == null)
      {
        return NotFound();
      }

      return course;
    }
    // PUT: api/Courses/5
    // To protect from overposting attacks, enable the specific properties you want to bind to, for
    // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
    [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(int id, [FromForm] Course course)
        {
      if (HttpContext.Request.Form.Files.Count > 0)
      {
        var file = HttpContext.Request.Form.Files[0];
        byte[] fileData = null;

        using (var binaryReader = new BinaryReader(file.OpenReadStream()))
        {
          fileData = binaryReader.ReadBytes((int)file.Length);
        }

        course.ThumbnailImage = fileData;
      }
      if (id != course.CourseId)
            {
                return BadRequest();
            }

            _context.Entry(course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseExists(id))
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

        // POST: api/Courses
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse([FromForm] Course course)
        {
      if (HttpContext.Request.Form.Files.Count > 0)
      {
        var file = HttpContext.Request.Form.Files[0];

        byte[] fileData = null;

        using (var binaryReader = new BinaryReader(file.OpenReadStream()))
        {
          fileData = binaryReader.ReadBytes((int)file.Length);
        }

        course.ThumbnailImage = fileData;
      }
      _context.Courses.Add(course);
      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateException)
      {
        if (CourseExists(course.CourseId))
        {
          return Conflict();
        }
        else
        {
          throw;
        }
      }
      return CreatedAtAction("GetCourses", new { id = course.CourseId }, course);
        }

        // DELETE: api/Courses/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Course>> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return course;
        }

        private bool CourseExists(int id)
        {
            return _context.Courses.Any(e => e.CourseId == id);
        }
    [HttpGet]
    [Route("GetCoursesWithAccountId{id}")]
    public async Task<ActionResult<IEnumerable<Course>>> GetCoursesWithAccountId(int id)
    {
      return await _context.Courses.Where(a => a.IsActive == true && a.AccountId == id).ToListAsync();
    }
  }
}
