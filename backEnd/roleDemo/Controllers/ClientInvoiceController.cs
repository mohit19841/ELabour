using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using labourRecruitment.Models.LabourRecruitment;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace labourRecruitment.Controllers
{
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class ClientInvoiceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientInvoiceController(ApplicationDbContext context)
        {
            _context = context;
        }

        public static bool IsSameWeek(DateTime dt1, DateTime dt2)
        {
            TimeSpan ts = (dt1 - dt2).Duration();
            return !(ts.TotalDays >= 7 || (DateTime.Compare(dt1, dt2) > 0 ? (dt1.DayOfWeek < dt2.DayOfWeek) : (dt1.DayOfWeek > dt2.DayOfWeek)));
        }


        [HttpPut]
        public IActionResult GetInvoice([FromBody] JobLabourer input)
        {
            List<ResultVM> results = new List<ResultVM>();
            var jobLabourers = _context.JobLabourer.Where(jb => jb.StartDay == input.StartDay && jb.EndDay == input.EndDay && jb.JobId == input.JobId)
                .Select(l => new JobLabourer
                {
                    SkillId = l.SkillId,
                    LabourerId = l.LabourerId,
                    Labourer = l.Labourer,
                    Skill = l.Skill,
                    JobId = l.JobId,
                    StartDay = l.StartDay,
                    EndDay = l.EndDay
                }).ToList();

            foreach (JobLabourer jb in jobLabourers)
            {
                var rate = _context.Skill.FirstOrDefault(s => s.SkillId == jb.SkillId).AdminReceives;
                var i = _context.LabourerAttendance.Where(la => la.LabourerId == jb.Labourer.LabourerId && la.JobId == jb.JobId
                && la.Date.CompareTo(jb.StartDay) >= 0 && la.Date.CompareTo(jb.EndDay) <= 0 && la.DailyQualityRating > 0).Count();
                results.Add(new ResultVM
                {
                    WorkedDays = i,
                    TotalHours = i * 8,
                    TotalAmount = rate * 8 * i,
                    Labourer = jb.Labourer,
                    Skill = jb.Skill
                });


            }
            return new ObjectResult(results);

        }

        [HttpGet("{jobId}")]
        public IActionResult GetInvoiceWeeks(int jobId)
        {
          
            var jobLabourers = _context.JobLabourer.Where(j => j.JobId == jobId).Select(j => new Week {
                FirstDay = j.StartDay,
                LastDay = j.EndDay,
                JobId = j.JobId
            }).Distinct();
            var weeks = jobLabourers.Where(jb => jb.LastDay.CompareTo(DateTime.Now) < 0);
            return new ObjectResult(weeks);
          
        }
          
   
        public class Week
        {
            public DateTime FirstDay { get; set; }
            public DateTime LastDay { get; set; }
            public int JobId { get; set; }
        }


        public class ResultVM
        {
            public int WorkedDays { get; set; }
            public int TotalHours { get; set; }
            public decimal TotalAmount { get; set; }
            public Labourer Labourer { get; set; }
            public Skill Skill { get; set; }
        }

     
    }
}