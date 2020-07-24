using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class LabourerIncidentReport
    {
        public int LabourerIncidentReportId { get; set; }
        public int? LabourerId { get; set; }
        public int? IncidentReportId { get; set; }

        public virtual IncidentReport IncidentReport { get; set; }
        public virtual Labourer Labourer { get; set; }
    }
}
