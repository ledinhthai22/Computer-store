using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.User
{
    public class ProfileUser
    {
        public string HoTen { get; set; } = null!;
        public string MatKhau{get;set;} = null!;
        public string? SoDienThoai { get; set; }
    }
}