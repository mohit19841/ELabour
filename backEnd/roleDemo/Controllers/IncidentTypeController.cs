using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using labourRecruitment.Models.LabourRecruitment;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace labourRecruitment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncidentTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IncidentTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IncidentType>>> GetIncidentType()
        {
            return await _context.IncidentType.ToListAsync();
        }
    }
}