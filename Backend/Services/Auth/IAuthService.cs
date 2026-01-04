using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTO;
using Backend.DTO.Auth;

namespace Backend.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResult> LoginAsync (LoginRequest req);
    }
}