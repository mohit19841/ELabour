using labourRecruitment.Models.LabourRecruitment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;

namespace labourRecruitment.Services
{
    public class EmailHelper
    {
        private EmailSettings _eSettings;
        public EmailHelper(EmailSettings _eSettings)
        {
            this._eSettings = _eSettings;
        }

        public void SendMail(string recipient, string subject, EmailContent emailContent)
        {
            
                MailMessage mail = new MailMessage()
                {
                    From = new MailAddress(_eSettings.FromEmail, _eSettings.DisplayName)
                };

                string toEmail = string.IsNullOrEmpty(recipient)
                                 ? _eSettings.ToEmail : recipient;

                mail.To.Add(new MailAddress(toEmail));

                // Subject and multipart/alternative Body
                mail.Subject = subject;

                string text = "Hi " + emailContent.LabourerFirstName + " " + emailContent.LabourerLastName +'\n'
                    + "Your job will start on : " + emailContent.JobStart.ToString() + '\n'
                    + "End on : " + emailContent.JobEnd.ToString() +'\n'
                    + "Location : " + emailContent.JobAddress;
                string html = @"<p>" + "Hi " + emailContent.LabourerFirstName + " " + emailContent.LabourerLastName + "</p>"
                              + @"<p>" + "Your job will start on : " + emailContent.JobStart.ToString("yyyy-MM-dd") + "</p>"
                              + @"<p>" + "End on : " + emailContent.JobEnd.ToString("yyyy-MM-dd") + "</p>"
                              + @"<p>" + "Location : " + emailContent.JobAddress + "</p>";

                mail.AlternateViews.Add(
                        AlternateView.CreateAlternateViewFromString(text,
                        null, MediaTypeNames.Text.Plain));
                mail.AlternateViews.Add(
                        AlternateView.CreateAlternateViewFromString(html,
                        null, MediaTypeNames.Text.Html));

                //optional priority setting
                mail.Priority = MailPriority.High;

                // you can add attachments
               // mail.Attachments.Add(new Attachment(@".\wwwroot\Resume.pdf"));

                // Init SmtpClient and send
                SmtpClient smtp = new SmtpClient(_eSettings.Domain, _eSettings.Port);
                smtp.Credentials = new NetworkCredential(_eSettings.UsernameLogin, _eSettings.UsernamePassword);
                smtp.EnableSsl = false;
                smtp.Send(mail);
          
        }
    }
    
    public class EmailContent
    {
        public string LabourerFirstName { get; set; }
        public string LabourerLastName { get; set; }
        public string JobAddress { get; set; }
        public DateTime JobStart { get; set; }
        public DateTime JobEnd { get; set; }
    }

}
