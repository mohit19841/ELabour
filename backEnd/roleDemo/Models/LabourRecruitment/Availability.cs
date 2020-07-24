using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class Availability
    {
        public Availability()
        {
            AvailabilityLabourer = new HashSet<AvailabilityLabourer>();
        }

        public int AvailabilityId { get; set; }
        public string AvailabilityDay { get; set; }

        public virtual ICollection<AvailabilityLabourer> AvailabilityLabourer { get; set; }
    }
}
