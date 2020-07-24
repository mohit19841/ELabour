using labourRecruitment.Models.LabourRecruitment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace labourRecruitment.ViewModels
{
    public class GetJobVM
    {
        public int JobId { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool? InProgress { get; set; }
        public bool? IsComplete { get; set; }
    }

    public class JobHistoryVM
    {
        public Job Job { get; set; }
        public string report { get; set; }
    }

    public class JobSkillVM
    {
        public Job Job { get; set; }
        public IEnumerable<JobSkill> JobSkills { get; set; }
    }

}
