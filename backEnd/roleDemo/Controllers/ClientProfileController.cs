using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using labourRecruitment.Models.LabourRecruitment;
using labourRecruitment.Repositories;
using labourRecruitment.ViewModels;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace labourRecruitment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientProfileController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ClientProfile
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Client>>> GetAllClients()
        {
            return await _context.Client.ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult<ClientProfileVM> GetClientProfile(int id)
        {
            return new ClientProfileVMRepo(_context).GetClient(id);
        }

        [HttpPut]
        public async Task<IActionResult> PutClientProfile(ClientProfileVM clientProfile)
        {
            var cp = _context.Client.SingleOrDefault(c => c.ClientId == clientProfile.Client.ClientId);

            if (cp == null)
            {
                return NotFound();
            }
            else
            {
                cp.ClientName = clientProfile.Client.ClientName;

                cp.ClientEmail = clientProfile.Client.ClientEmail;

                cp.ClientPhoneNumber = clientProfile.Client.ClientPhoneNumber;

                cp.ClientCity = clientProfile.Client.ClientCity;

                cp.ClientState = clientProfile.Client.ClientState;

                cp.ClientDescription = clientProfile.Client.ClientDescription;

            }

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                throw;
            }
            return NoContent();
        }

        // POST: api/Clients
        [HttpPost]
        public async Task<ActionResult<Client>> PostClient(Client client)
        {
            _context.Client.Add(client);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClient", new { id = client.ClientId }, client);
        }

        // DELETE: api/

        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteClientProfile(int id)
        {


            var lb = await _context.Client.FindAsync(id);
            if (lb == null)
            {
                return NotFound();
            }

            _context.Client.Remove(lb);
            await _context.SaveChangesAsync();
            return new ObjectResult(lb);

        }
    }
}