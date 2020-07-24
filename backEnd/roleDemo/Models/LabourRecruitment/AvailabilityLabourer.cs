using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class AvailabilityLabourer
    {
        public int AvailabilityLobourerId { get; set; }
        public int? AvailabilityId { get; set; }
        public int? LabourerId { get; set; }

        public virtual Availability Availability { get; set; }
        public virtual Labourer Labourer { get; set; }
    }
}
