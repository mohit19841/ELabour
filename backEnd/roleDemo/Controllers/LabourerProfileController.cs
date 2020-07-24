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
    public class LabourerProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LabourerProfileController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<Labourer>>> GetAllLabourers()
        {
            var labourers = _context.Labourer.Where(l => l.IsAvailable == true).ToList();
            return await _context.Labourer.ToListAsync();
        }

        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public ActionResult<LabourerProfileVM> GetLabourerProfile(int id)
        {
            return new LabourerProfileVMRepo(_context).GetLabourer(id);
        }


        [HttpPut("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult PutLabourerProfile(LabourerProfileVM labourerProfile)
        {
            var lp = _context.Labourer.SingleOrDefault(l => l.LabourerId == labourerProfile.Labourer.LabourerId);

            if (lp == null)
            {
                return NotFound();
            }
            else
            {
                lp.LabourerFirstName = labourerProfile.Labourer.LabourerFirstName;
                lp.LabourerLastName = labourerProfile.Labourer.LabourerLastName;
                lp.IsAvailable = labourerProfile.Labourer.IsAvailable;
                lp.LabourerEmail = labourerProfile.Labourer.LabourerEmail;
            }

            _context.LabourerSkill.RemoveRange(_context.LabourerSkill.Where(al => al.LabourerId == labourerProfile.Labourer.LabourerId));

            foreach (string skillName in labourerProfile.Skills.Select(s => s.SkillName))
            {
                Skill skill = _context.Skill.Where(s => s.SkillName == skillName).FirstOrDefault();
                if (skill != null)
                {
                    LabourerSkill labourerSkill = new LabourerSkill
                    {
                        SkillId = skill.SkillId,
                        LabourerId = labourerProfile.Labourer.LabourerId
                    };
                    _context.LabourerSkill.Add(labourerSkill);
                    _context.SaveChanges();
                }
                else
                {
                    return NotFound();
                }

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

        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult ToggleOnLeave(Labourer labourer)
        {
            var selectedLabourer = _context.Labourer.FirstOrDefault(l => l.LabourerId == labourer.LabourerId);

            if (selectedLabourer == null)
            {
                return NotFound();
            }
            else
            {
                selectedLabourer.OnLeave = labourer.OnLeave;
                if(labourer.OnLeave == true)
                {
                    selectedLabourer.IsAvailable = false;
                } else
                {
                    selectedLabourer.IsAvailable = true;
                }
                _context.SaveChanges();
            }
            return new ObjectResult(labourer);
        }

        // DELETE: api/LabourerProfile
        [HttpDelete]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> DeleteLabourerProfile(int id)
        {


            var lb = await _context.Labourer.FindAsync(id);
            if (lb == null)
            {
                return NotFound();
            }

            _context.Labourer.Remove(lb);
            await _context.SaveChangesAsync();
            return new ObjectResult(lb);

        }
    }
}
