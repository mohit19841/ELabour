using labourRecruitment.Models.LabourRecruitment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace labourRecruitment.ViewModels
{
    public class IncidentVM
    {
        public int? IncidentReportId { get; set; }
        public DateTime? IncidentReportDate { get; set; }
        public string IncidentType { get; set; }
        public string JobTitle { get; set; }
    }

    public class IncidentDetailVM
    {
        public IncidentReport IncidentReport { get; set; }
        public IEnumerable<JobLabourer> JobLabourers { get; set; }
    }

    public class IncidentClientVM
    {
        public IncidentReport IncidentReport { get; set; }
        public Client Client { get; set; }
    }

    public class IncidentReportVM
    {
        public IncidentReport IncidentReport { get; set; }
        public IEnumerable<LabourerIncidentReport> LabourerReports { get; set; }
    }
}
