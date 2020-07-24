using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class Client
    {
        public Client()
        {
            Job = new HashSet<Job>();
        }

        public int ClientId { get; set; }
        public int? UserId { get; set; }
        public string ClientName { get; set; }
        public string ClientEmail { get; set; }
        public string ClientPhoneNumber { get; set; }
        public string ClientCity { get; set; }
        public string ClientState { get; set; }
        public string ClientDescription { get; set; }

        public virtual SystemUser User { get; set; }
        public virtual ICollection<Job> Job { get; set; }
    }
}
