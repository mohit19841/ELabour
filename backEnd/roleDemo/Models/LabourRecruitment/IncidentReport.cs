using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class IncidentReport
    {
        public IncidentReport()
        {
            LabourerIncidentReport = new HashSet<LabourerIncidentReport>();
        }

        public int IncidentReportId { get; set; }
        public int? IncidentTypeId { get; set; }
        public int? JobId { get; set; }
        public DateTime? IncidentReportDate { get; set; }
        public string IncidentReportDescription { get; set; }
        public string IncidentReportFile { get; set; }
        public bool? AdminNotified { get; set; }

        public virtual IncidentType IncidentType { get; set; }
        public virtual Job Job { get; set; }
        public virtual ICollection<LabourerIncidentReport> LabourerIncidentReport { get; set; }
    }
}
