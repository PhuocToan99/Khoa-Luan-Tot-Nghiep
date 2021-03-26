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
    public class AccountinLessonsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountinLessonsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AccountinLessons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountinLesson>>> GetAccountinLessons()
        {
            return await _context.AccountinLessons.ToListAsync();
        }

        // GET: api/AccountinLessons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AccountinLesson>> GetAccountinLesson(int id)
        {
            var accountinLesson = await _context.AccountinLessons.FindAsync(id);

            if (accountinLesson == null)
            {
                return NotFound();
            }

            return accountinLesson;
        }

        // PUT: api/AccountinLessons/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAccountinLesson(int id, AccountinLesson accountinLesson)
        {
            if (id != accountinLesson.AccountinLessonID)
            {
                return BadRequest();
            }

            _context.Entry(accountinLesson).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AccountinLessonExists(id))
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

        // POST: api/AccountinLessons
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<AccountinLesson>> PostAccountinLesson(AccountinLesson accountinLesson)
        {
            _context.AccountinLessons.Add(accountinLesson);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AccountinLessonExists(accountinLesson.AccountinLessonID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetAccountinLesson", new { id = accountinLesson.AccountinLessonID }, accountinLesson);
        }

        // DELETE: api/AccountinLessons/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<AccountinLesson>> DeleteAccountinLesson(int id)
        {
            var accountinLesson = await _context.AccountinLessons.FindAsync(id);
            if (accountinLesson == null)
            {
                return NotFound();
            }

            _context.AccountinLessons.Remove(accountinLesson);
            await _context.SaveChangesAsync();

            return accountinLesson;
        }

        private bool AccountinLessonExists(int id)
        {
            return _context.AccountinLessons.Any(e => e.AccountinLessonID == id);
        }
    }
}
