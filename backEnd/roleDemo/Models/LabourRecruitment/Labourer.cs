using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class Labourer
    {
        public Labourer()
        {
            AvailabilityLabourer = new HashSet<AvailabilityLabourer>();
            JobLabourer = new HashSet<JobLabourer>();
            LabourerAttendance = new HashSet<LabourerAttendance>();
            LabourerIncidentReport = new HashSet<LabourerIncidentReport>();
            LabourerSkill = new HashSet<LabourerSkill>();
        }

        public int LabourerId { get; set; }
        public int? UserId { get; set; }
        public string LabourerFirstName { get; set; }
        public string LabourerLastName { get; set; }
        public int? LabourerSin { get; set; }
        public string LabourerEmail { get; set; }
        public bool IsAvailable { get; set; }
        public bool OnLeave { get; set; }

        public virtual SystemUser User { get; set; }
        public virtual ICollection<AvailabilityLabourer> AvailabilityLabourer { get; set; }
        public virtual ICollection<JobLabourer> JobLabourer { get; set; }
        public virtual ICollection<LabourerAttendance> LabourerAttendance { get; set; }
        public virtual ICollection<LabourerIncidentReport> LabourerIncidentReport { get; set; }
        public virtual ICollection<LabourerSkill> LabourerSkill { get; set; }
    }
}
