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
    public class ClientAssignController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientAssignController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetHighestRatingClients()
        {
           List<Client> clients = await _context.Job.Where(j => j.InProgress == true && j.EndDate >= DateTime.Now.AddDays(10)).Select(oj=>oj.Client).ToListAsync();

            List<ClientAssignVM> clientvms = clients.Select(c => new ClientAssignVM()
            {
                client = c,
                averageRating = 0,

            }).ToList();

            foreach (ClientAssignVM clientvm in clientvms)
            {
               List<JobVM> jobs = await _context.Job.Where(j => j.ClientId == clientvm.client.ClientId).Select(oj=> new JobVM() { 
               job=oj,
               jobAverageRating=0,
               }).ToListAsync();
                foreach (JobVM job in jobs)
                {
                    List<JobLabourer> jls = await _context.JobLabourer.Where(jl => jl.JobId == job.job.JobId).ToListAsync();
                   job.jobAverageRating = jls.Average(av => av.ClientQualityRating);
                }
                clientvm.averageRating = jobs.Average(avj => avj.jobAverageRating);
            }

            clientvms = clientvms.OrderByDescending(c => c.averageRating).ToList();

            var clientsorted = clientvms.Select(cvm => new ClientVM
            {
                ClientCity = cvm.client.ClientCity,
                ClientDescription = cvm.client.ClientDescription,
                ClientEmail = cvm.client.ClientEmail,
                ClientId = cvm.client.ClientId,
                ClientName = cvm.client.ClientName,
                ClientPhoneNumber = cvm.client.ClientPhoneNumber,
                ClientState = cvm.client.ClientState,
                UserId = cvm.client.UserId,
                ClientAverageRating =cvm.averageRating
            }).ToList();


            if (clientsorted != null)
            {
                return new ObjectResult(clientsorted);
            }
            else
            {
                return NotFound();
            }
        }
        
        public class ClientAssignVM
        {
            public Client client { get; set; }
            public double? averageRating { get; set; }
        }

        public class JobVM
        {
            public Job job { get; set; }
            public double? jobAverageRating { get; set; }
        }

        public class ClientVM
        {
            public int ClientId { get; set; }
            public int? UserId { get; set; }
            public string ClientName { get; set; }
            public string ClientEmail { get; set; }
            public string ClientPhoneNumber { get; set; }
            public string ClientCity { get; set; }
            public string ClientState { get; set; }
            public string ClientDescription { get; set; }
            public double? ClientAverageRating { get; set; }
        }

    }
}