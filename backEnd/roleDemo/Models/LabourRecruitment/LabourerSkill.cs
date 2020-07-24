using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class LabourerSkill
    {
        public int LabourerSkillId { get; set; }
        public int LabourerId { get; set; }
        public int SkillId { get; set; }

        public virtual Labourer Labourer { get; set; }
        public virtual Skill Skill { get; set; }
    }
}
