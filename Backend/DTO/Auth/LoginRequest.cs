using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO
{
    public class LoginRequest
    {
        [Required]
        public string TenTaiKhoan { get; set; } = null!;

        [Required]
        public string MatKhau { get; set; } = null!;
    }
}