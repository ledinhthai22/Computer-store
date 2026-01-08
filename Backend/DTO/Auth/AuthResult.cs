using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Auth
{
    public class AuthResult
    {
        public bool Success { get; set; }
        public int MaNguoiDung {get;set;}
        public string ?Message { get; set; }
        public string ?HoTen { get; set; }
        public string ?VaiTro { get; set; }
    }
}