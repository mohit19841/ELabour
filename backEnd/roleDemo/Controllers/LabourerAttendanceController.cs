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
    public class LabourerAttendanceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LabourerAttendanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public IActionResult GetScheduleDaysByJobId(int id)
        {
            var days = _context.LabourerAttendance.Where(jl => jl.JobId == id).Select(l=>l.Date).Distinct();
            return new ObjectResult(days);
        }

        [HttpGet, Route("data")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetLabourersByScheduleDay(int jobId, DateTime date)
        {
            var labourers = _context.LabourerAttendance.Where(la => la.JobId == jobId & la.Date == date).Select(l => new LabourerAttendance
            {
                DailyQualityRating = l.DailyQualityRating,
                Date = l.Date,
                Labourer = l.Labourer,
                Job = l.Job
            });
            return new ObjectResult(labourers);
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetLabourerAttendanceRating([FromBody] LabourerAttendance la)
        {
            var labourerAttendances = _context.LabourerAttendance.Where(l => l.LabourerId == la.LabourerId && l.JobId == la.JobId && l.DailyQualityRating != null);

            if (labourerAttendances != null)
            {
                return new ObjectResult(labourerAttendances);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> PutLabourerAttendanceRating([FromBody] LabourerAttendance la)
        {
            var labourerAttendance = _context.LabourerAttendance.SingleOrDefault(l => l.LabourerId == la.LabourerId && l.JobId == la.JobId && l.Date == la.Date);

            if (labourerAttendance == null)
            {
                _context.LabourerAttendance.Add(la);
            }
            else
            {
                labourerAttendance.DailyQualityRating = la.DailyQualityRating;
            }

            await _context.SaveChangesAsync();

            return new ObjectResult(la);

        }

    }
}