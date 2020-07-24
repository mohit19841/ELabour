using System;
using System.Collections.Generic;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class LabourerAttendance
    {
        public int LabourerAttendanceId { get; set; }
        public int? JobId { get; set; }
        public int? LabourerId { get; set; }
        public double? DailyQualityRating { get; set; }
        public DateTime Date { get; set; }

        public virtual Job Job { get; set; }
        public virtual Labourer Labourer { get; set; }
    }
}
