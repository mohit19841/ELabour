using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using labourRecruitment.Models.LabourRecruitment;
using labourRecruitment.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using roleDemo.ViewModels;

namespace roleDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private IConfiguration _config;
        private IServiceProvider _serviceProvider;
        private ApplicationDbContext _context;

        public LoginController(SignInManager<IdentityUser> signInManager,
                                IConfiguration config,
                                IServiceProvider serviceProvider,
                                ApplicationDbContext context)
        {
            _signInManager = signInManager;
            _config = config;
            _serviceProvider = serviceProvider;
            _context = context;
        }

        [HttpPost]
        public async Task<JsonResult> OnPostAsync([FromBody]LoginVM loginVM)
        {
            dynamic jsonResponse = new JObject();
            if (ModelState.IsValid)
            {
                var result = await
                            _signInManager.PasswordSignInAsync(loginVM.Email.ToUpper(),
                            loginVM.Password, loginVM.RememberMe, lockoutOnFailure: true);
                if (result.Succeeded)
                {
                    AuthRepo loginRepo = new AuthRepo(_signInManager, _config, _serviceProvider, _context);
                    var UserManager = _serviceProvider
                        .GetRequiredService<UserManager<IdentityUser>>();
                    var user = await UserManager.FindByEmailAsync(loginVM.Email);

                    if (user != null)
                    {
                        var sysuser = _context.SystemUser.FirstOrDefault(u => u.Email == loginVM.Email);
                        var tokenString = loginRepo.GenerateJSONWebToken(user);

                        if (sysuser.Role == "Client")
                        {
                            jsonResponse.name = _context.Client.FirstOrDefault(c => c.UserId == sysuser.UserId).ClientName;
                        } else if (sysuser.Role == "Labourer") 
                        {
                            jsonResponse.name = _context.Labourer.FirstOrDefault(l => l.UserId == sysuser.UserId).LabourerFirstName
                                + " " +_context.Labourer.FirstOrDefault(l => l.UserId == sysuser.UserId).LabourerLastName;
                        } else if (sysuser.Role == "Administrator")
                        {
                            jsonResponse.name = "Admin";
                        }

                        jsonResponse.token = tokenString;
                        jsonResponse.status = "OK";
                        jsonResponse.role = sysuser.Role;
                        jsonResponse.email = sysuser.Email;
                        jsonResponse.id = loginRepo.GetIdByRole(sysuser.Email, sysuser.Role);
                        return Json(jsonResponse);
                    }
                }
                else if (result.IsLockedOut)
                {
                    jsonResponse.token = "";
                    jsonResponse.status = "Locked Out";
                    return Json(jsonResponse);
                }
            }
            jsonResponse.token = "";
            jsonResponse.status = "Invalid Login";
            return Json(jsonResponse);
        }

    }
}
