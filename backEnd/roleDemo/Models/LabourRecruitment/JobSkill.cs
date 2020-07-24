using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class JobSkill
    {
        public int JobSkillId { get; set; }
        public int JobId { get; set; }
        public int SkillId { get; set; }
        public int NumberNeeded { get; set; }

        public virtual Job Job { get; set; }
        public virtual Skill Skill { get; set; }
    }
}
