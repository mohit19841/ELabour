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
    public class SkillsLabourerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SkillsLabourerController(ApplicationDbContext context)
        {
            _context = context;
        }

        
        // GET: api/SkillsLabourer/5
        [HttpGet("{labourerId}", Name = "GetSkillsByLabourerId")]
        public async Task<ActionResult<IEnumerable<LabourerSkill>>> GetSkillsByLabourerId(int labourerId)
        {


            return await _context.LabourerSkill.Where(l => l.LabourerId == labourerId).Select(l => new LabourerSkill
            {
                Skill = l.Skill
            }).ToListAsync();
        }


        

        private bool LabourerSkillExists(int id)
        {
            return _context.LabourerSkill.Any(e => e.LabourerSkillId == id);
        }
    }
}
