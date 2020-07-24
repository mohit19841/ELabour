using labourRecruitment.Models.LabourRecruitment;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace labourRecruitment.Repositories
{
    public class AuthRepo
    {
        private readonly ApplicationDbContext _context;
        private IConfiguration _config;
        private readonly SignInManager<IdentityUser> _signInManager;
        private IServiceProvider _serviceProvider;

        public AuthRepo(SignInManager<IdentityUser> signInManager,
                                IConfiguration config,
                                IServiceProvider serviceProvider,
                                ApplicationDbContext context)
        {
            _signInManager = signInManager;
            _serviceProvider = serviceProvider;
            _context = context;
            _config = config;
        }

         public List<Claim> AddUserRoleClaims(List<Claim> claims, string userId)
        {
            // Get current user's roles. 
            var userRoleList = _context.UserRoles.Where(ur => ur.UserId == userId);
            var roleList = from ur in userRoleList
                           from r in _context.Roles
                           where r.Id == ur.RoleId
                           select new { r.Name };

            // Add each of the user's roles to the claims list.
            foreach (var roleItem in roleList)
            {
                claims.Add(new Claim(ClaimTypes.Role, roleItem.Name));
            }
            return claims;
        }

        public string GenerateJSONWebToken(IdentityUser user)
        {
            var securityKey
               = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials
                = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti,
                            Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };


            claims = AddUserRoleClaims(claims, user.Id);

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Issuer"],
                claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public int GetIdByRole(string userEmail, string role)
        {
            int id = 0;
            if (role.IndexOf("client", 0, StringComparison.CurrentCultureIgnoreCase) != -1)
            {
                var client = _context.Client.Where(c => c.ClientEmail == userEmail).FirstOrDefault();
                id = client.ClientId;
            }
            else if (role.IndexOf("labourer", 0, StringComparison.CurrentCultureIgnoreCase) != -1)
            {
                Labourer labourer = _context.Labourer.Where(l => l.LabourerEmail == userEmail).FirstOrDefault();
                id = labourer.LabourerId;
            }
            return id;
        }

    }
}
