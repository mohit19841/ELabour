using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using labourRecruitment.Models.LabourRecruitment;

namespace labourRecruitment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvailabilityLabourersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AvailabilityLabourersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AvailabilityLabourers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AvailabilityLabourer>>> GetAvailabilityLabourer()
        {
            return await _context.AvailabilityLabourer.ToListAsync();
        }

        // GET: api/AvailabilityLabourers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AvailabilityLabourer>> GetAvailabilityLabourer(int id)
        {
            var availabilityLabourer = await _context.AvailabilityLabourer.FindAsync(id);

            if (availabilityLabourer == null)
            {
                return NotFound();
            }

            return availabilityLabourer;
        }

        // PUT: api/AvailabilityLabourers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAvailabilityLabourer(int id, AvailabilityLabourer availabilityLabourer)
        {
            if (id != availabilityLabourer.AvailabilityLobourerId)
            {
                return BadRequest();
            }

            _context.Entry(availabilityLabourer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AvailabilityLabourerExists(id))
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

        // POST: api/AvailabilityLabourers
        [HttpPost]
        public async Task<ActionResult<AvailabilityLabourer>> PostAvailabilityLabourer(AvailabilityLabourer availabilityLabourer)
        {
            _context.AvailabilityLabourer.Add(availabilityLabourer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAvailabilityLabourer", new { id = availabilityLabourer.AvailabilityLobourerId }, availabilityLabourer);
        }

        // DELETE: api/AvailabilityLabourers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<AvailabilityLabourer>> DeleteAvailabilityLabourer(int id)
        {
            var availabilityLabourer = await _context.AvailabilityLabourer.FindAsync(id);
            if (availabilityLabourer == null)
            {
                return NotFound();
            }

            _context.AvailabilityLabourer.Remove(availabilityLabourer);
            await _context.SaveChangesAsync();

            return availabilityLabourer;
        }

        private bool AvailabilityLabourerExists(int id)
        {
            return _context.AvailabilityLabourer.Any(e => e.AvailabilityLobourerId == id);
        }
    }
}
