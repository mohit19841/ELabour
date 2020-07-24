using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class JobLabourer
    {
        public int JobLabourerId { get; set; }
        public int JobId { get; set; }
        public int SkillId { get; set; }
        public int LabourerId { get; set; }
        public double? ClientQualityRating { get; set; }
        public double? LabourerSafetyRating { get; set; }
        public bool SafetyMeetingCompleted { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }
        public int Duration { get; set; }

        public virtual Job Job { get; set; }
        public virtual Labourer Labourer { get; set; }
        public virtual Skill Skill { get; set; }
    }
}
