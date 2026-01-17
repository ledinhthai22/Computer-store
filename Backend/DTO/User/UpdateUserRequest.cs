using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.User
{
    public class UpdateUserRequest
    {
    
        [Required]
        public string HoTen {get;set;} = null!;
        [Required]
        public bool GioiTinh {get;set;}
        public DateTime NgaySinh { get; set; }
        [Required]
        public string SoDienThoai {get;set;} = null!;

    }
}