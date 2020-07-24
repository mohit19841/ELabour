using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class Skill
    {
        public Skill()
        {
            JobLabourer = new HashSet<JobLabourer>();
            JobSkill = new HashSet<JobSkill>();
            LabourerSkill = new HashSet<LabourerSkill>();
        }

        public int SkillId { get; set; }
        public string SkillName { get; set; }
        public decimal AdminReceives { get; set; }
        public decimal LabourerReceives { get; set; }

        public virtual ICollection<JobLabourer> JobLabourer { get; set; }
        public virtual ICollection<JobSkill> JobSkill { get; set; }
        public virtual ICollection<LabourerSkill> LabourerSkill { get; set; }
    }
}
