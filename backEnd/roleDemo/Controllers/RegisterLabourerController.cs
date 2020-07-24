using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using labourRecruitment.Models.LabourRecruitment;
using labourRecruitment.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using roleDemo.ViewModels;

namespace roleDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterLabourerController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private IConfiguration _config;
        private IServiceProvider _serviceProvider;
        private readonly ApplicationDbContext _context;

        public RegisterLabourerController(
                UserManager<IdentityUser> userManager,
                SignInManager<IdentityUser> signInManager,
                 IServiceProvider serviceProvider,
                ApplicationDbContext context,
                IConfiguration config)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            _serviceProvider = serviceProvider;
            _context = context;
        }

        [HttpPost]
        public async Task<JsonResult> OnPostAsync([FromBody]LabourerRegisterVM input)
        {
            var user = new IdentityUser { UserName = input.User.Email.ToLower(), Email = input.User.Email };
            var result = await _userManager.CreateAsync(user, input.User.Password);
            var errorList = new List<string>();

            dynamic jsonResponse = new JObject();
            if (result.Succeeded)
            {
                SystemUser sysUser = new SystemUser()
                {
                    Email = input.User.Email,
                    Role = "Labourer"
                };

                Labourer labourer = new Labourer
                {
                    LabourerFirstName = input.Labourer.LabourerFirstName,
                    LabourerLastName = input.Labourer.LabourerLastName,
                    LabourerSin = input.Labourer.LabourerSin,
                    LabourerEmail = input.User.Email,
                    IsAvailable = true,
                    OnLeave = false
                };
                _context.SystemUser.Add(sysUser);
                sysUser.Labourer.Add(labourer);
                _context.SaveChanges();

                //if (input.AvailableDays != null)
                //{

                //    foreach (string day in input.AvailableDays)
                //    {
                //        Availability availability = _context.Availability.Where(a => a.AvailabilityDay == day).FirstOrDefault();

                //        AvailabilityLabourer availabilityLabourer = new AvailabilityLabourer
                //        {
                //            AvailabilityId = availability.AvailabilityId,
                //            LabourerId = labourer.LabourerId
                //        };
                //        _context.AvailabilityLabourer.Add(availabilityLabourer);
                //        _context.SaveChanges();
                //    }
                //}
                //else
                //{
                //    await _userManager.DeleteAsync(user);
                //    _context.Labourer.Remove(labourer);
                //    _context.SystemUser.Remove(sysUser);
                //    _context.SaveChanges();
                //    jsonResponse.status = "Available day is not valid";
                //    jsonResponse.token = " ";
                //    return Json(jsonResponse);
                //}


                foreach (int skillId in input.Skills)
                {
                    LabourerSkill labourerSkill = new LabourerSkill
                    {
                        SkillId = skillId,
                        LabourerId = labourer.LabourerId
                    };
                    _context.LabourerSkill.Add(labourerSkill);
                    _context.SaveChanges();

                }

                AuthRepo registerRepo = new AuthRepo(_signInManager, _config, _serviceProvider, _context);
                var tokenString = registerRepo.GenerateJSONWebToken(user);
                jsonResponse.token = tokenString;
                jsonResponse.status = "OK";
                jsonResponse.role = "Labourer";
                jsonResponse.email = sysUser.Email;
                jsonResponse.id = labourer.LabourerId;
                jsonResponse.name = labourer.LabourerFirstName + ' ' + labourer.LabourerLastName;
                return Json(jsonResponse);

            }

            foreach (IdentityError error in result.Errors)
            {
                errorList.Add(error.Description);
            }
            jsonResponse.status = 422;
            jsonResponse.description = errorList[0];
            jsonResponse.token = "";
            return Json(jsonResponse);

        }

    }

}