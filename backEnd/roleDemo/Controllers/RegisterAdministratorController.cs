using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using labourRecruitment.Models.LabourRecruitment;
using labourRecruitment.Repositories;
using labourRecruitment.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;

namespace labourRecruitment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterAdministratorController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private IConfiguration _config;
        private IServiceProvider _serviceProvider;
        private readonly ApplicationDbContext _context;

        public RegisterAdministratorController(
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
        public async Task<JsonResult> OnPostAsync([FromBody]SystemUser input)
        {
            var user = new IdentityUser { UserName = input.Email.ToLower(), Email = input.Email };
            var result = await _userManager.CreateAsync(user, input.Password);
            var errorList = new List<string>();

            dynamic jsonResponse = new JObject();

            if (result.Succeeded)
            {
                SystemUser sysUser = new SystemUser()
                {
                    Email = input.Email,
                    Role = "Admin"
                };

                _context.SystemUser.Add(sysUser);

                _context.SaveChanges();

                AuthRepo registerRepo = new AuthRepo(_signInManager, _config, _serviceProvider, _context);
                var tokenString = registerRepo.GenerateJSONWebToken(user);
                jsonResponse.token = tokenString;
                jsonResponse.status = "OK";
                jsonResponse.role = "Admin";
                jsonResponse.email = sysUser.Email;
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