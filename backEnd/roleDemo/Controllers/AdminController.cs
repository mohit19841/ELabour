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
    [Route("api/[controller]/[action]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Admin/GetClientCount
        [HttpGet(Name = "GetClientCount")]
        public int GetClientCount()
        {
            return _context.Client.Count();
        }

        // GET: api/Admin/GetLabourerCount
        [HttpGet(Name = "GetLabourerCount")]
        public int GetLabourerCount()
        {
            return _context.Labourer.Count();
        }

        // GET: api/Admin/GetIncidentCount
        [HttpGet(Name = "GetIncidentCount")]
        public int GetIncidentCount()
        {
            return _context.IncidentReport.Count();
        }
    }
}
