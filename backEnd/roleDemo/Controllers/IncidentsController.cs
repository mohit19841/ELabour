using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using labourRecruitment.Models.LabourRecruitment;
using labourRecruitment.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace labourRecruitment.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class IncidentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IncidentsController(ApplicationDbContext context)
        {
            _context = context;
        }


        // GET: api/Incidents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IncidentReport>>> GetAllIncidents()
        {
            var reports = await _context.IncidentReport.ToListAsync();
            foreach (IncidentReport report in reports)
            {
                report.LabourerIncidentReport = _context.LabourerIncidentReport.Where(lr => lr.IncidentReportId == report.IncidentReportId).
                    Select(r => new LabourerIncidentReport
                    {
                        Labourer = r.Labourer
                    }).ToList();

                report.IncidentType = _context.IncidentType.Where(i => i.IncidentTypeId == report.IncidentTypeId).Select(i => new IncidentType
                {
                    IncidentTypeName = i.IncidentTypeName
                }).FirstOrDefault();
                report.Job = _context.Job.Where(j => j.JobId == report.JobId).Select(j => new Job
                {
                    Title = j.Title
                }).FirstOrDefault();
            }
            return reports;
        }

        // GET: api/Incidents/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<IncidentDetailVM>> GetIncidentByIncidentId(int id)
        {
            var incident = await _context.IncidentReport.FindAsync(id);

            if (incident == null)
            {
                return NotFound();
            }

            incident.Job = _context.Job.Where(j => j.JobId == incident.JobId).Select(j => new Job
            {
                Title = j.Title,
                Street = j.Street,
                City = j.City,
                State = j.State,
                ClientId = j.ClientId,
                Client = j.Client,
            }).FirstOrDefault();

            incident.IncidentType = _context.IncidentType.Where(i => i.IncidentTypeId == incident.IncidentTypeId).Select(i => new IncidentType
            {
                IncidentTypeName = i.IncidentTypeName
            }).FirstOrDefault();


            var labourers = _context.LabourerIncidentReport.Where(l => l.IncidentReportId == id).Select(l => l.LabourerId).ToList();
            List<JobLabourer> jobLabourers = new List<JobLabourer>();
            labourers.ForEach(l =>
            {
                var jobLabourer = _context.JobLabourer.Where(jl => jl.LabourerId == l).Select(jl => new JobLabourer
                {
                    LabourerSafetyRating = jl.LabourerSafetyRating,
                    LabourerId = jl.LabourerId,
                    Labourer = jl.Labourer
                }).FirstOrDefault();
                jobLabourers.Add(jobLabourer);
            });

            return new IncidentDetailVM
            {
                IncidentReport = incident,
                JobLabourers = jobLabourers
            };
        }

        // GET: api/Incidents/GetIncidentsByJobId/{jobId}
        [HttpGet("{jobId}")]
        public IActionResult GetIncidentsByJobId(int jobId)
        {

            var incident = _context.IncidentReport.Where(j => j.JobId == jobId).Select(i => new IncidentReport {
                IncidentReportId = i.IncidentReportId,
                IncidentReportDate = i.IncidentReportDate,
                Job = i.Job,
                IncidentType = i.IncidentType,
                LabourerIncidentReport = i.LabourerIncidentReport

            }).ToList();


            if (incident == null)
            {
                return NotFound();
            }
            return new ObjectResult(incident);
        }

        // GET: api/Incidents/GetIncidentsByLabourerId/{labourerId}
        [HttpGet("{labourerId}", Name = "GetIncidentsByLabourerId")]
        public IActionResult GetIncidentsByLabourerId(int labourerId)
        {
            var incident = _context.LabourerIncidentReport.Where(l => l.LabourerId == labourerId).
                Select(l => new IncidentVM
                {
                    IncidentReportId = l.IncidentReportId,
                    IncidentReportDate = l.IncidentReport.IncidentReportDate,
                    IncidentType = l.IncidentReport.IncidentType.IncidentTypeName,
                    JobTitle = l.IncidentReport.Job.Title

                }).ToList();

            if (incident == null)
            {
                return NotFound();
            }
            return new ObjectResult(incident);
        }

        // GET: api/Incidents/GetIncidentsByClientId/{clientId}
        [HttpGet("{clientId}", Name = "GetIncidentsByClientId")]
        public IActionResult GetIncidentsByClientId(int clientId)
        {
            var incident = _context.LabourerIncidentReport.Where(l => l.IncidentReport.Job.Client.ClientId == clientId)
                .Select(l => new IncidentVM
                {
                    IncidentReportId = l.IncidentReportId,
                    IncidentReportDate = l.IncidentReport.IncidentReportDate,
                    IncidentType = l.IncidentReport.IncidentType.IncidentTypeName,
                    JobTitle = l.IncidentReport.Job.Title

                })
                .Distinct();

            if (incident == null)
            {
                return NotFound();
            }
            return new ObjectResult(incident);
        }

        [HttpGet(Name = "GetIncidentsNotNotified")]
        public IActionResult GetIncidentsNotNotified()
        {
            var incidents = _context.IncidentReport.Where(i => i.AdminNotified == false).Select(i => new IncidentClientVM
            {
                IncidentReport = i,
                Client = i.Job.Client
            }).ToList();

            return new ObjectResult(incidents);
        }

        // POST: api/Incidents
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult PostIncident(IncidentReportVM report)
        {
            _context.IncidentReport.Add(report.IncidentReport);

            foreach (LabourerIncidentReport labourerReport in report.LabourerReports)
            {
                labourerReport.IncidentReportId = report.IncidentReport.IncidentReportId;
                _context.LabourerIncidentReport.Add(labourerReport);
            }
            _context.SaveChanges();
            return new ObjectResult(report.IncidentReport.IncidentReportId);
        }

        [HttpPut("{id}")]
        public IActionResult ChangeAdminNotified(int id)
        {
            var incident = _context.IncidentReport.FirstOrDefault(i => i.IncidentReportId == id);
            if (incident != null)
            {
                incident.AdminNotified = true;
            }
            else
            {
                return BadRequest();
            }
            _context.SaveChanges();
            return new ObjectResult(incident);
        }
    }
}