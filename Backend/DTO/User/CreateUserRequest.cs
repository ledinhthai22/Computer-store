using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.User
{
    public class CreateUserRequest
    {
        [Required]
        public string HoTen {get;set;} = null!;
        [Required]
        public string Email {get;set;} =null!;
        [Required]
        public string MatKhau{get;set;} = null!;
        [Required]
        public string SoDienThoai {get;set;} =null!;

    }
}