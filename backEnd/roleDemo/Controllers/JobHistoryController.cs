using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using labourRecruitment.Models.LabourRecruitment;
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
    public class JobHistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobHistoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/LabourerID
        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<IEnumerable<JobHistoryVM>>> GetJobHistorys(int id)
        {
            return await _context.JobLabourer.Where(jl => jl.LabourerId == id).Select(ojl => new JobHistoryVM()
            {
                Job = ojl.Job,
                report = ojl.ClientQualityRating != null ? "Complete" : "Required"
            }).ToListAsync();
        }



        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetLabourerSafetyRating([FromBody] JobLabourer jlr)
        {
            var jobLabourer = _context.JobLabourer.SingleOrDefault(jl => jl.LabourerId == jlr.LabourerId && jl.JobId == jlr.JobId);

            if (jobLabourer != null)
            {
                return new ObjectResult(jobLabourer.LabourerSafetyRating);
            }
            else
            {
                return NotFound();
            }
        }



        [HttpPut]
        [Route("ClientQuality")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult PutClientQualityRating([FromBody] JobLabourer jlr)
        {
            var jobLabourer = _context.JobLabourer.SingleOrDefault(jl => jl.LabourerId == jlr.LabourerId && jl.JobId == jlr.JobId);

            if (jobLabourer != null)
            {
                jobLabourer.ClientQualityRating = jlr.ClientQualityRating;
            }
            else
            {
                return NotFound();
            }

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                throw;
            }
            return new ObjectResult(jobLabourer);
        }


        [HttpPut]
        [Route("LabourerSafety")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult PutLabourerSafetyRating([FromBody] JobLabourer jlr)
        {
            var jobLabourer = _context.JobLabourer.SingleOrDefault(jl => jl.LabourerId == jlr.LabourerId && jl.JobId == jlr.JobId);

            if (jobLabourer != null)
            {
                jobLabourer.LabourerSafetyRating = jlr.LabourerSafetyRating;
            }
            else
            {
                return NotFound();
            }

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateException)
            {
                throw;
            }
            return new ObjectResult(jobLabourer);
        }

    }

}