using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class SystemUser
    {
        public SystemUser()
        {
            Client = new HashSet<Client>();
            Labourer = new HashSet<Labourer>();
        }

        public int UserId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }

        public virtual ICollection<Client> Client { get; set; }
        public virtual ICollection<Labourer> Labourer { get; set; }
    }
}
