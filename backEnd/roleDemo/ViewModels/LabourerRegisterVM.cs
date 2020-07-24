using labourRecruitment.Models.LabourRecruitment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace roleDemo.ViewModels
{
    public class LabourerRegisterVM
    {
        public SystemUser User { get; set; }
        public Labourer Labourer { get; set; }
        public IEnumerable<string> AvailableDays { get; set; }
        public IEnumerable<int> Skills { get; set; }
    }
}
