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
    public class LabourerAssignController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LabourerAssignController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetHighestRatingLabourers(int id)
        {
            List<Labourer> labourers = await _context.LabourerSkill.Where(ls => ls.SkillId == id).Select(ols => ols.Labourer
                        ).Where(l=>l.IsAvailable == true).ToListAsync();

            List<LabourerAssignVM> labourerAss = labourers.Select(l => new LabourerAssignVM()
            {
                labourer = l,
                averageQualityRating = _context.LabourerAttendance.Where(la => la.LabourerId == l.LabourerId).Average(las => las.DailyQualityRating == null ? 0 : las.DailyQualityRating),
                averageSafetyRating = _context.JobLabourer.Where(la => la.LabourerId == l.LabourerId).Average(lss => lss.LabourerSafetyRating == null ? 5 : lss.LabourerSafetyRating),
                averageRating = ((_context.LabourerAttendance.Where(la => la.LabourerId == l.LabourerId).Average(las => las.DailyQualityRating == null ? 0 : las.DailyQualityRating))
                + (_context.JobLabourer.Where(la => la.LabourerId == l.LabourerId).Average(lss => lss.LabourerSafetyRating == null ? 5 : lss.LabourerSafetyRating))) /2 
            }).ToList();

            labourerAss = labourerAss.OrderByDescending(la => la.averageRating).ToList();

            if (labourerAss != null)
            {
                return new ObjectResult(labourerAss);
            }
            else
            {
                return NotFound();
            }
        }

        public class LabourerAssignVM
        {
            public Labourer labourer { get; set; }
            public double? averageQualityRating { get; set; }
            public double? averageSafetyRating { get; set; }
            public double? averageRating { get; set; }
        }

    }
}