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
    public class LabourerPayrollController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LabourerPayrollController(ApplicationDbContext context)
        {
            _context = context;
        }


        public static bool IsSameWeek(DateTime dt1, DateTime dt2)
        {
            TimeSpan ts = (dt1 - dt2).Duration();
            return !(ts.TotalDays >= 7 || (DateTime.Compare(dt1, dt2) > 0 ? (dt1.DayOfWeek < dt2.DayOfWeek) : (dt1.DayOfWeek > dt2.DayOfWeek)));
        }

        [HttpGet("{dateInput}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetPayroll(DateTime dateInput)
        {
            List<Labourer> labourers =await _context.LabourerAttendance.Where(ja => IsSameWeek(ja.Date, dateInput) && ja.DailyQualityRating != null && ja.DailyQualityRating != 0)
                .Select(oja => oja.Labourer).ToListAsync();

            List<LabourerAttendance> labourerAttendances = await _context.LabourerAttendance.Where(la => IsSameWeek(la.Date, dateInput) && la.DailyQualityRating != null && la.DailyQualityRating != 0)
                .ToListAsync();

            var labourerGrouped = labourers.GroupBy(g => g.LabourerId).Select(s=>s.First()).ToList();

            List<LabourerPayrollVM> LabourerPayrollVMs = labourerGrouped.Select(l => new LabourerPayrollVM()
            {
                labourer = l,
                LabourerFullName = l.LabourerFirstName + " " + l.LabourerLastName,
                Hours = 0,
                AmountPaid = 0,
                Jobs = null
            }).ToList();

            foreach (LabourerPayrollVM labourerPayrollVm in LabourerPayrollVMs)
            {
                var oneLabourerAttendances=_context.LabourerAttendance.Where(la => IsSameWeek(la.Date, dateInput) && la.DailyQualityRating != null && la.DailyQualityRating != 0 && la.LabourerId == labourerPayrollVm.labourer.LabourerId)
                    .ToList();

                List<JobVM> jobVMs = oneLabourerAttendances.GroupBy(g=>g.JobId).Select(ola => ola.First()).Select(j=> new JobVM()
                {
                JobId = j.JobId,
                SkillId = 0,
                Hours = 0,
                Paid = 0
                }).ToList();

                var hours = 0;
                decimal? paid = 0;
                foreach(JobVM jobvm in jobVMs)
                {
                    var oneJobLabourer = _context.JobLabourer.FirstOrDefault(jl => jl.JobId == jobvm.JobId && jl.LabourerId == labourerPayrollVm.labourer.LabourerId);
                    var LabourerReceive = _context.Skill.FirstOrDefault(s => s.SkillId == oneJobLabourer.SkillId).LabourerReceives;
                    var jobHours = oneLabourerAttendances.Where(la => la.JobId == jobvm.JobId).Count() * 8;
                    var jobPaid = LabourerReceive * jobHours;
                    //var skill = _context.JobLabourer.FirstOrDefault(jl => jl.JobId == jobvm.JobId && jl.LabourerId == labourerPayrollVm.labourer.LabourerId);
                    var skill = _context.Skill.FirstOrDefault(s => s.SkillId == oneJobLabourer.SkillId).SkillId;
                    jobvm.Hours = jobHours;
                    jobvm.Paid = jobPaid;
                    jobvm.SkillId = skill;
                    jobvm.PaidPerHour = LabourerReceive;
                    hours = hours + jobvm.Hours;
                    paid = paid + jobvm.Paid;
                }

                labourerPayrollVm.Hours = hours;
                labourerPayrollVm.AmountPaid = paid;
                labourerPayrollVm.Jobs = jobVMs;
            }

            var LabourerPayrollVMsClean = LabourerPayrollVMs.Select(lpv => new LabourerPayrollCleanVM
            {
                LabourerId = lpv.labourer.LabourerId,
                LabourerFullName = lpv.LabourerFullName,
                Hours = lpv.Hours,
                AmountPaid = lpv.AmountPaid,
                Jobs = lpv.Jobs
            }).ToList();


            if (LabourerPayrollVMsClean != null)
            {
                return new ObjectResult(LabourerPayrollVMsClean);
            }
            else
            {
                return NotFound();
            }
        }

        public class LabourerPayrollVM
        {
            public Labourer labourer { get; set; }
            public string LabourerFullName { get; set; }
            public int Hours { get; set; }
            public decimal? AmountPaid { get; set; }
            public List<JobVM> Jobs { get; set; }

        }

        public class JobVM
        {
            public int? JobId { get; set; }
            public int SkillId { get; set; }
            public int Hours { get; set; }
            public decimal? PaidPerHour { get; set; }
            public decimal? Paid { get; set; }
        }

        public class LabourerPayrollCleanVM
        {
            public int LabourerId { get; set; }
            public string LabourerFullName { get; set; }
            public int Hours { get; set; }
            public decimal? AmountPaid { get; set; }
            public List<JobVM> Jobs { get; set; }
        }
    }
}