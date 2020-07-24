using labourRecruitment.Models.LabourRecruitment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace labourRecruitment.Services
{
    public class GetHighestRated
    {
        private readonly ApplicationDbContext _context;
        public GetHighestRated(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Labourer> GetHighestRatedLabourers(int id)
        {
            List<Labourer> labourers = _context.LabourerSkill.Where(ls => ls.SkillId == id).Select(ols => ols.Labourer).ToList();

            List<LabourerAssignVM> labourerAss = labourers.Select(l => new LabourerAssignVM()
            {
                labourer = l,
                averageQualityRating = _context.LabourerAttendance.Where(la => la.LabourerId == l.LabourerId).Average(las => las.DailyQualityRating == null ? 0 : las.DailyQualityRating),
                averageSafetyRating = _context.JobLabourer.Where(la => la.LabourerId == l.LabourerId).Average(lss => lss.LabourerSafetyRating == null ? 5 : lss.LabourerSafetyRating),
                averageRating = ((_context.LabourerAttendance.Where(la => la.LabourerId == l.LabourerId).Average(las => las.DailyQualityRating == null ? 0 : las.DailyQualityRating))
                + (_context.JobLabourer.Where(la => la.LabourerId == l.LabourerId).Average(lss => lss.LabourerSafetyRating == null ? 5 : lss.LabourerSafetyRating))) / 2
            }).ToList();

            List<Labourer> labourerSorted = labourerAss.OrderByDescending(la => la.averageRating).Select(la => la.labourer).ToList();
            return labourerSorted;
        }

        public IEnumerable<Client> GetHighestRatingClients()
        {
            List<Client> clients = _context.Job.Where(j => j.InProgress == true && j.ScheduleDone != true).Select(oj => oj.Client).ToList();

            List<ClientAssignVM> clientvms = clients.Select(c => new ClientAssignVM()
            {
                client = c,
                averageRating = 0,

            }).ToList();

            foreach (ClientAssignVM clientvm in clientvms)
            {
                List<JobVM> jobs = _context.Job.Where(j => j.ClientId == clientvm.client.ClientId).Select(oj => new JobVM()
                {
                    job = oj,
                    jobAverageRating = 0,
                }).ToList();
                foreach (JobVM job in jobs)
                {
                    List<JobLabourer> jls = _context.JobLabourer.Where(jl => jl.JobId == job.job.JobId).ToList();
                    job.jobAverageRating = jls.Average(av => av.ClientQualityRating);
                }
                clientvm.averageRating = jobs.Average(avj => avj.jobAverageRating);
            }

            List<Client> clientSorted = clientvms.OrderByDescending(c => c.averageRating).Select(c => c.client).Distinct().ToList();
            return clientSorted;

        }

        public class LabourerAssignVM
        {
            public Labourer labourer { get; set; }
            public double? averageQualityRating { get; set; }
            public double? averageSafetyRating { get; set; }
            public double? averageRating { get; set; }
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
