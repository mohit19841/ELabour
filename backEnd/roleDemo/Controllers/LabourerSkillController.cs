using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using labourRecruitment.Models.LabourRecruitment;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace labourRecruitment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LabourerSkillController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LabourerSkillController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetLabourersBySkillId(int id)
        {
            List<Labourer> labourers = await _context.LabourerSkill.Where(ls => ls.SkillId == id).Select(ols => ols.Labourer
            ).ToListAsync();
            if (labourers != null)
            {
                return new ObjectResult(labourers);
            }
            else
            {
                return NotFound();
            }
        }

    }
}