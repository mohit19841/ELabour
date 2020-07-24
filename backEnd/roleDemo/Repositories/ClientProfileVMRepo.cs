using labourRecruitment.Models.LabourRecruitment;
using labourRecruitment.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace labourRecruitment.Repositories
{
    public class ClientProfileVMRepo
    {
        private readonly ApplicationDbContext _context;
        public ClientProfileVMRepo(ApplicationDbContext context)
        {
            _context = context;
        }


        public ClientProfileVM GetClient(int clientID)
        {
            /*
            Client Client = _context.Client.FirstOrDefault(c => c.ClientId == clientID);
            
            var avgerageQuality = _context.JobLabourer
                 .Where(j => j.Job.ClientId == clientID && j.ClientQualityRating != null).Average(av => av.ClientQualityRating);
            ClientProfileVM cp = new ClientProfileVM()
            {
                Client = Client,

                AverageRating = avgerageQuality

            };
            */

            ClientProfileVM cp;
            
            try
            {
                Client Client = _context.Client.First(c => c.ClientId == clientID);
                var rating = _context.JobLabourer
                    .Where(j => j.Job.ClientId == clientID && j.ClientQualityRating != null)
                    .Average(av => av.ClientQualityRating)
                ;
                cp = new ClientProfileVM()
                {
                    Client = Client,
                    AverageRating = rating
                };
            }
            catch(InvalidOperationException)
            {
                cp = new ClientProfileVM(){};
            }

            return cp;
        }
    }
}
