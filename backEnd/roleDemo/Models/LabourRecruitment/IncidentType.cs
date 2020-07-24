using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class IncidentType
    {
        public IncidentType()
        {
            IncidentReport = new HashSet<IncidentReport>();
        }

        public int IncidentTypeId { get; set; }
        public string IncidentTypeName { get; set; }

        public virtual ICollection<IncidentReport> IncidentReport { get; set; }
    }
}
