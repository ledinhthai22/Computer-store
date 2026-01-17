using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.User
{
    public class ChangePasswordRequest
    {
        [Required]
        public string MatKhauCu { get; set; } = null!;

        [Required]
        public string MatKhauMoi { get; set; } = null!;

        [Required]
        [Compare("MatKhauMoi", ErrorMessage = "Xác nhận mật khẩu không khớp")]
        public string XacNhanMatKhau { get; set; } = null!;
    }
}
