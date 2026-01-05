using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Auth
{
    public class RegisterRequest
    {
        [Required]

        public string HoTen { get; set; } = null!;
        [Required]
        [EmailAddress]
        [MaxLength(75)]
        public string Email { get; set; } = null!;
        [Required]
        public string SoDienThoai { get; set; } = null!;
        [Required]
        [MinLength(8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$",
            ErrorMessage = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt.")]
        public string MatKhau { get; set; } = null!;
        [Required]
        [Compare("MatKhau", ErrorMessage = "Mật khẩu xác nhận không khớp.")]
        public string XacNhanMatKhau { get; set; } = null!;
    }
}