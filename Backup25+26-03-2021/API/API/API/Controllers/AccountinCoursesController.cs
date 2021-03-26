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
    public class AccountinCoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountinCoursesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AccountinCourses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountinCourse>>> GetAccountinCourses()
        {
            return await _context.AccountinCourses.ToListAsync();
        }

        // GET: api/AccountinCourses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AccountinCourse>> GetAccountinCourse(int id)
        {
            var accountinCourse = await _context.AccountinCourses.FindAsync(id);

            if (accountinCourse == null)
            {
                return NotFound();
            }

            return accountinCourse;
        }

        // PUT: api/AccountinCourses/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccountinCourse(int id, AccountinCourse accountinCourse)
        {
            if (id != accountinCourse.AccountinCourseID)
            {
                return BadRequest();
            }

            _context.Entry(accountinCourse).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountinCourseExists(id))
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

        // POST: api/AccountinCourses
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<AccountinCourse>> PostAccountinCourse(AccountinCourse accountinCourse)
        {
            _context.AccountinCourses.Add(accountinCourse);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AccountinCourseExists(accountinCourse.AccountinCourseID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetAccountinCourse", new { id = accountinCourse.AccountinCourseID }, accountinCourse);
        }

        // DELETE: api/AccountinCourses/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<AccountinCourse>> DeleteAccountinCourse(int id)
        {
            var accountinCourse = await _context.AccountinCourses.FindAsync(id);
            if (accountinCourse == null)
            {
                return NotFound();
            }

            _context.AccountinCourses.Remove(accountinCourse);
            await _context.SaveChangesAsync();

            return accountinCourse;
        }

        private bool AccountinCourseExists(int id)
        {
            return _context.AccountinCourses.Any(e => e.AccountinCourseID == id);
        }
    }
}
