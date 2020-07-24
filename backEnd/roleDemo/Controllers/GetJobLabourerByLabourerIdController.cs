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
    [ApiController]
    public class GetJobLabourerByLabourerIdController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetJobLabourerByLabourerIdController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult GetLabourerByLabourerId(int id)
        {
            List<JobLabourer> Joblabourers = _context.JobLabourer.Where(jl => jl.LabourerId == id).ToList();

            return new ObjectResult(Joblabourers);
        }

    }
}