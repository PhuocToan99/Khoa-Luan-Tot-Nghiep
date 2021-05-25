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
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CoursesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/GetCourseList
        [HttpGet]
        [Route("GetCourseList")]
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
            return await _context.Courses.Where(a => a.IsActive == true).OrderByDescending(c => c.CourseId).ToListAsync();
        }
        // GET: api/Courses/All
        [HttpGet]
        [Route("AllCourses")]
        public async Task<ActionResult<IEnumerable<Course>>> GetCoursesAll()
        {
            return await _context.Courses.OrderByDescending(c => c.CourseId).ToListAsync();
        }

        // GET: api/GetCourse5
        [HttpGet]
        [Route("GetCourse{id}")]
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
        [Route("TopCourses")]
        public async Task<ActionResult<IEnumerable<Course>>> GetTop5Certifications()
        {
            return await _context.Courses.Where(e => e.IsActive == true).OrderByDescending(e => e.CourseId).Take(6).ToListAsync();
        }
        // GET: api/GetCourse/name
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
        [HttpPut]
        [Route("EditCourse{id}")]
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

        // POST: api/AddCourse
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [Route("AddCourse")]
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
        [HttpDelete]
        [Route("DeleteCourse{id}")]
        public async Task<ActionResult<Course>> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }
            var topic = await _context.Topics.Where(e => e.CourseId == id).ToListAsync();
            if (topic != null)
            {
                var subtopicResult = await _context.SubTopics.ToListAsync();
                var subtopicList = new List<SubTopic>();
                topic.ForEach(e =>
                {
                    var result = subtopicResult.Find(s => s.TopicId == e.TopicId);
                    if (result != null)
                    {
                        subtopicList.Add(result);
                    }
                });
                if (subtopicList != null)
                {
                    var lessonBefore = await _context.Lessons.ToListAsync();
                    var lessonList = new List<Lesson>();
                    for (var i = 0; i < subtopicList.Count(); i++)
                    {
                        lessonBefore.ForEach(
                        e => {
                            if (e.SubTopicId == subtopicList[i].SubTopicId)
                            {
                                lessonList.Add(e);
                            }
                        });
                    }
                    lessonList.ForEach(e => _context.Lessons.Remove(e));
                    subtopicList.ForEach(e => _context.SubTopics.Remove(e));
                    topic.ForEach(e => _context.Topics.Remove(e));
                }
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
