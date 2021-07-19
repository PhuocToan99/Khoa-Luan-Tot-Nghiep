using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Models;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;
using System.Net;

namespace API.Controllers
{
    [Route("api")]
    [ApiController]
    public class AccountinCoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountinCoursesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/GetAccountInCoursesList
        [HttpGet]
        [Route("GetAccountInCoursesList")]
        public async Task<ActionResult<IEnumerable<AccountinCourse>>> GetAccountinCourses()
        {
            return await _context.AccountinCourses.ToListAsync();
        }

        // GET: api/GetAccountInCourses5
        [HttpGet]
        [Route("GetAccountInCourses{id}")]
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
        [HttpPut]
        [Route("EditAccountInCourse{id}")]
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

        // POST: api/AddAccountInCourse
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        [Route("AddAccountInCourse")]
        public async Task<ActionResult<AccountinCourse>> PostAccountinCourse(AccountinCourse accountinCourse)
        {
            _context.AccountinCourses.Add(accountinCourse);
            var course = await _context.Courses.FindAsync(accountinCourse.CourseId);
            course.NumberOfParticipants++;
            _context.Entry(course).State = EntityState.Modified;
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
        [HttpDelete]
        [Route("DeleteAccountInCourse{id}")]
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
        [HttpGet]
        [Route("GetAccountInCoursesByAccountid")]
        public async Task<IEnumerable<AccountinCourse>> GetAccountInCoursesByAccountid(int id,int option)
        {

        var accountinCourse = (option == 1) ? await _context.AccountinCourses.Where(e => e.AccountId == id && e.IsBought == true).OrderByDescending(e => e.AccountinCourseID).ToListAsync() :
        await _context.AccountinCourses.Where(e => e.AccountId == id && e.GetPayment == true).OrderByDescending(e => e.AccountinCourseID).ToListAsync();

            if (accountinCourse == null)
            {
                return null;
            }

            return accountinCourse;
        }
    [HttpGet]
    [Route("GetAccountInCoursesByInvoiceCode")]
    public async Task<IEnumerable<AccountinCourse>> GetAccountInCoursesByInvoiceCode(int option,string invoiceCode)
    {

      var accountinCourse = (option == 1) ? await _context.AccountinCourses.Where(e => e.InvoiceCode == invoiceCode && e.IsBought == true).OrderByDescending(e => e.AccountinCourseID).ToListAsync() :
      await _context.AccountinCourses.Where(e => e.InvoiceCode == invoiceCode && e.GetPayment == true).OrderByDescending(e => e.AccountinCourseID).ToListAsync();

      if (accountinCourse == null)
      {
        return null;
      }

      return accountinCourse;
    }
    [HttpGet]
    [Route("GetMyCourseList")]
    public async Task<IEnumerable<Course>> GetMyCourseList(int id)
    {
      List<Course> courseList = new List<Course>();
      var accountinCourse = await _context.AccountinCourses.Where(e => e.AccountId == id && e.IsBought == true).ToListAsync();
      if (accountinCourse != null)
      {
        var list = await _context.Courses.Where(e => e.IsActive == true).ToListAsync();
        accountinCourse.ForEach(e =>
        {
          var result = list.Find(course => course.CourseId == e.CourseId);
          courseList.Add(result);
        });
        return courseList;
      }
      return courseList;
    }
    [HttpPost]
    [Route("AddCartItem")]
    public async Task<ActionResult<AccountinCourse>> PostCartItem(AccountinCourse accountinCourse)
    {
      var temp = await _context.AccountinCourses.ToListAsync();
      var result = temp.Find(e => e.CourseId == accountinCourse.CourseId && e.AccountId == accountinCourse.AccountId && e.IsCart == true);
      if(result == null)
      {
        _context.AccountinCourses.AddRange(accountinCourse);
        await _context.SaveChangesAsync();
      }
      return CreatedAtAction("GetAccountinCourse", new { id = accountinCourse.AccountinCourseID }, accountinCourse);
    }
    public class CartItem
    {
      public Course Course { get; set; }
      public int Quantity { get; set; }
    }
    [HttpGet]
    [Route("GetCartList")]
    public async Task<IEnumerable<CartItem>> GetCartList(int id)
    {
      List<CartItem> cartList = new List<CartItem>();
      var accountinCourse = await _context.AccountinCourses.Where(e => e.AccountId == id && e.IsCart == true).ToListAsync();
      if (accountinCourse != null)
      {
        var list = await _context.Courses.Where(e => e.IsActive == true).ToListAsync();
        accountinCourse.ForEach(e =>
        {
          var cartItem = new CartItem();
          var result = list.Find(course => course.CourseId == e.CourseId);
          cartItem.Course = result;
          cartItem.Quantity = 1;
          cartList.Add(cartItem);
        });
        return cartList;
      }
      return cartList;
    }
    private bool CartExists(AccountinCourse accountinCourse)
    {
      return _context.AccountinCourses.Any(e => e.CourseId == accountinCourse.CourseId && e.AccountId == accountinCourse.AccountId && e.IsCart == true);
    }
    [HttpDelete]
    [Route("DeleteCartItem")]
    public async Task<IEnumerable<AccountinCourse>> DeleteCartItem(int accountId, int courseId)
    {
      var accountinCourse = await _context.AccountinCourses.Where(e => e.AccountId == accountId && e.CourseId == courseId && e.IsCart == true).ToListAsync();
      if (accountinCourse != null)
      {
        _context.AccountinCourses.RemoveRange(accountinCourse);
        await _context.SaveChangesAsync();
      }
      return accountinCourse;
    }
    [HttpDelete]
    [Route("EmptyCartItem")]
    public async Task<IEnumerable<AccountinCourse>> EmptyCartItem(int accountId)
    {
      var accountinCourse = await _context.AccountinCourses.Where(e => e.AccountId == accountId && e.IsCart == true).ToListAsync();
      if (accountinCourse != null)
      {
        _context.AccountinCourses.RemoveRange(accountinCourse);
        await _context.SaveChangesAsync();
      }
      return accountinCourse;
    }
    [HttpPost]
    [Route("TransferData")]
    public async Task<int> Post(int value)
    {
      HttpClient httpClient = new HttpClient();
      HttpContent content = new StringContent(
          JsonConvert.SerializeObject(value),
          Encoding.UTF8,
          "application/json"
      );
      HttpResponseMessage response = await httpClient.PostAsync("http://localhost:5001/api/default", content);
           return await response.Content.ReadAsAsync<int>();

    }
  }
}
