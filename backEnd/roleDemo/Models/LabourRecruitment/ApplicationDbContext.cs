using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace labourRecruitment.Models.LabourRecruitment
{
    public partial class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext()
        {
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Availability> Availability { get; set; }
        public virtual DbSet<AvailabilityLabourer> AvailabilityLabourer { get; set; }
        public virtual DbSet<Client> Client { get; set; }
        public virtual DbSet<IncidentReport> IncidentReport { get; set; }
        public virtual DbSet<IncidentType> IncidentType { get; set; }
        public virtual DbSet<Job> Job { get; set; }
        public virtual DbSet<JobLabourer> JobLabourer { get; set; }
        public virtual DbSet<JobSkill> JobSkill { get; set; }
        public virtual DbSet<Labourer> Labourer { get; set; }
        public virtual DbSet<LabourerAttendance> LabourerAttendance { get; set; }
        public virtual DbSet<LabourerIncidentReport> LabourerIncidentReport { get; set; }
        public virtual DbSet<LabourerSkill> LabourerSkill { get; set; }
        public virtual DbSet<Skill> Skill { get; set; }
        public virtual DbSet<SystemUser> SystemUser { get; set; }

        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.HasAnnotation("ProductVersion", "2.2.6-servicing-10079");

            modelBuilder.Entity<Availability>(entity =>
            {
                entity.Property(e => e.AvailabilityId).HasColumnName("availability_id");

                entity.Property(e => e.AvailabilityDay)
                    .HasColumnName("availability_day")
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<AvailabilityLabourer>(entity =>
            {
                entity.HasKey(e => e.AvailabilityLobourerId)
                    .HasName("PK__Availabi__786BC512ACB8B3CF");

                entity.Property(e => e.AvailabilityLobourerId).HasColumnName("availabilityLobourer_id");

                entity.Property(e => e.AvailabilityId).HasColumnName("availability_id");

                entity.Property(e => e.LabourerId).HasColumnName("labourer_id");

                entity.HasOne(d => d.Availability)
                    .WithMany(p => p.AvailabilityLabourer)
                    .HasForeignKey(d => d.AvailabilityId)
                    .HasConstraintName("FK__Availabil__avail__2F10007B");

                entity.HasOne(d => d.Labourer)
                    .WithMany(p => p.AvailabilityLabourer)
                    .HasForeignKey(d => d.LabourerId)
                    .HasConstraintName("FK__Availabil__labou__2E1BDC42");
            });

            modelBuilder.Entity<Client>(entity =>
            {
                entity.Property(e => e.ClientId).HasColumnName("client_id");

                entity.Property(e => e.ClientCity)
                    .HasColumnName("client_city")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ClientDescription)
                    .HasColumnName("client_description")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ClientEmail)
                    .HasColumnName("client_email")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.ClientName)
                    .HasColumnName("client_name")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ClientPhoneNumber)
                    .HasColumnName("client_phone_number")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.ClientState)
                    .HasColumnName("client_state")
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Client)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Client__user_id__267ABA7A");
            });

            modelBuilder.Entity<IncidentReport>(entity =>
            {
                entity.Property(e => e.IncidentReportId).HasColumnName("incident_report_id");

                entity.Property(e => e.AdminNotified).HasColumnName("adminNotified");

                entity.Property(e => e.IncidentReportDate)
                    .HasColumnName("incident_report_date")
                    .HasColumnType("date");

                entity.Property(e => e.IncidentReportDescription)
                    .HasColumnName("incident_report_description")
                    .HasColumnType("text");

                entity.Property(e => e.IncidentReportFile)
                    .HasColumnName("incident_report_file")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.IncidentTypeId).HasColumnName("incident_type_id");

                entity.Property(e => e.JobId).HasColumnName("job_id");

                entity.HasOne(d => d.IncidentType)
                    .WithMany(p => p.IncidentReport)
                    .HasForeignKey(d => d.IncidentTypeId)
                    .HasConstraintName("FK__IncidentR__incid__3C69FB99");

                entity.HasOne(d => d.Job)
                    .WithMany(p => p.IncidentReport)
                    .HasForeignKey(d => d.JobId)
                    .HasConstraintName("FK__IncidentR__job_i__3D5E1FD2");
            });

            modelBuilder.Entity<IncidentType>(entity =>
            {
                entity.Property(e => e.IncidentTypeId).HasColumnName("incident_type_id");

                entity.Property(e => e.IncidentTypeName)
                    .HasColumnName("incident_type_name")
                    .HasMaxLength(30)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Job>(entity =>
            {
                entity.Property(e => e.JobId).HasColumnName("job_id");

                entity.Property(e => e.City)
                    .HasColumnName("city")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ClientId).HasColumnName("client_id");

                entity.Property(e => e.EndDate)
                    .HasColumnName("end_date")
                    .HasColumnType("date");

                entity.Property(e => e.InProgress).HasColumnName("inProgress");

                entity.Property(e => e.IsComplete).HasColumnName("isComplete");

                entity.Property(e => e.JobDescription)
                    .HasColumnName("job_description")
                    .HasColumnType("text");

                entity.Property(e => e.PostalCode)
                    .HasColumnName("postal_code")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ScheduleDone).HasColumnName("schedule_done");

                entity.Property(e => e.StartDate)
                    .HasColumnName("start_date")
                    .HasColumnType("date");

                entity.Property(e => e.State)
                    .HasColumnName("state")
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Street)
                    .HasColumnName("street")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Title)
                    .HasColumnName("title")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.TotalHired).HasColumnName("total_hired");

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.Job)
                    .HasForeignKey(d => d.ClientId)
                    .HasConstraintName("FK__Job__client_id__31EC6D26");
            });

            modelBuilder.Entity<JobLabourer>(entity =>
            {
                entity.Property(e => e.JobLabourerId).HasColumnName("job_labourer_id");

                entity.Property(e => e.ClientQualityRating).HasColumnName("client_quality_rating");

                entity.Property(e => e.Duration).HasColumnName("duration");

                entity.Property(e => e.EndDay)
                    .HasColumnName("end_day")
                    .HasColumnType("datetime");

                entity.Property(e => e.JobId).HasColumnName("job_id");

                entity.Property(e => e.LabourerId).HasColumnName("labourer_id");

                entity.Property(e => e.LabourerSafetyRating).HasColumnName("labourer_safety_rating");

                entity.Property(e => e.SafetyMeetingCompleted).HasColumnName("safety_meeting_completed");

                entity.Property(e => e.SkillId).HasColumnName("skill_id");

                entity.Property(e => e.StartDay)
                    .HasColumnName("start_day")
                    .HasColumnType("datetime");

                entity.HasOne(d => d.Job)
                    .WithMany(p => p.JobLabourer)
                    .HasForeignKey(d => d.JobId)
                    .HasConstraintName("FK__JobLabour__job_i__47DBAE45");

                entity.HasOne(d => d.Labourer)
                    .WithMany(p => p.JobLabourer)
                    .HasForeignKey(d => d.LabourerId)
                    .HasConstraintName("FK__JobLabour__labou__48CFD27E");

                entity.HasOne(d => d.Skill)
                    .WithMany(p => p.JobLabourer)
                    .HasForeignKey(d => d.SkillId)
                    .HasConstraintName("FK__JobLabour__skill__49C3F6B7");
            });

            modelBuilder.Entity<JobSkill>(entity =>
            {
                entity.Property(e => e.JobSkillId).HasColumnName("job_skill_id");

                entity.Property(e => e.JobId).HasColumnName("job_id");

                entity.Property(e => e.NumberNeeded).HasColumnName("number_needed");

                entity.Property(e => e.SkillId).HasColumnName("skill_id");

                entity.HasOne(d => d.Job)
                    .WithMany(p => p.JobSkill)
                    .HasForeignKey(d => d.JobId)
                    .HasConstraintName("FK__JobSkill__job_id__403A8C7D");

                entity.HasOne(d => d.Skill)
                    .WithMany(p => p.JobSkill)
                    .HasForeignKey(d => d.SkillId)
                    .HasConstraintName("FK__JobSkill__skill___412EB0B6");
            });

            modelBuilder.Entity<Labourer>(entity =>
            {
                entity.Property(e => e.LabourerId).HasColumnName("labourer_id");

                entity.Property(e => e.IsAvailable).HasColumnName("isAvailable");

                entity.Property(e => e.LabourerEmail)
                    .HasColumnName("labourer_email")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.LabourerFirstName)
                    .HasColumnName("labourer_first_name")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LabourerLastName)
                    .HasColumnName("labourer_last_name")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LabourerSin).HasColumnName("labourer_SIN");

                entity.Property(e => e.OnLeave).HasColumnName("onLeave");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Labourer)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK__Labourer__user_i__29572725");
            });

            modelBuilder.Entity<LabourerAttendance>(entity =>
            {
                entity.Property(e => e.LabourerAttendanceId).HasColumnName("labourer_attendance_id");

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("date");

                entity.Property(e => e.JobId).HasColumnName("job_id");

                entity.Property(e => e.LabourerId).HasColumnName("labourer_id");

                entity.HasOne(d => d.Job)
                    .WithMany(p => p.LabourerAttendance)
                    .HasForeignKey(d => d.JobId)
                    .HasConstraintName("FK__LabourerA__job_i__36B12243");

                entity.HasOne(d => d.Labourer)
                    .WithMany(p => p.LabourerAttendance)
                    .HasForeignKey(d => d.LabourerId)
                    .HasConstraintName("FK__LabourerA__labou__37A5467C");
            });

            modelBuilder.Entity<LabourerIncidentReport>(entity =>
            {
                entity.Property(e => e.LabourerIncidentReportId).HasColumnName("labourer_incident_report_id");

                entity.Property(e => e.IncidentReportId).HasColumnName("incident_report_id");

                entity.Property(e => e.LabourerId).HasColumnName("labourer_id");

                entity.HasOne(d => d.IncidentReport)
                    .WithMany(p => p.LabourerIncidentReport)
                    .HasForeignKey(d => d.IncidentReportId)
                    .HasConstraintName("FK__LabourerI__incid__4D94879B");

                entity.HasOne(d => d.Labourer)
                    .WithMany(p => p.LabourerIncidentReport)
                    .HasForeignKey(d => d.LabourerId)
                    .HasConstraintName("FK__LabourerI__labou__4CA06362");
            });

            modelBuilder.Entity<LabourerSkill>(entity =>
            {
                entity.Property(e => e.LabourerSkillId).HasColumnName("labourer_skill_id");

                entity.Property(e => e.LabourerId).HasColumnName("labourer_id");

                entity.Property(e => e.SkillId).HasColumnName("skill_id");

                entity.HasOne(d => d.Labourer)
                    .WithMany(p => p.LabourerSkill)
                    .HasForeignKey(d => d.LabourerId)
                    .HasConstraintName("FK__LabourerS__labou__440B1D61");

                entity.HasOne(d => d.Skill)
                    .WithMany(p => p.LabourerSkill)
                    .HasForeignKey(d => d.SkillId)
                    .HasConstraintName("FK__LabourerS__skill__44FF419A");
            });

            modelBuilder.Entity<Skill>(entity =>
            {
                entity.Property(e => e.SkillId).HasColumnName("skill_id");

                entity.Property(e => e.AdminReceives)
                    .HasColumnName("admin_receives")
                    .HasColumnType("decimal(18, 0)");

                entity.Property(e => e.LabourerReceives)
                    .HasColumnName("labourer_receives")
                    .HasColumnType("decimal(18, 0)");

                entity.Property(e => e.SkillName)
                    .HasColumnName("skill_name")
                    .HasMaxLength(30)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<SystemUser>(entity =>
            {
                entity.HasKey(e => e.UserId)
                    .HasName("PK__SystemUs__B9BE370FF3E568C0");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .HasColumnName("password")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Role)
                    .HasColumnName("role")
                    .HasMaxLength(15)
                    .IsUnicode(false);
            });
        }
    }
}
