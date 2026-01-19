using System.ComponentModel.DataAnnotations;

namespace Ecommerce.DTO.DeliveryAddress
{
    public class CreateDeliveryAddress
    {
        [Required(ErrorMessage = "Tên người nhận là bắt buộc")]
        public string TenNguoiNhan { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [MaxLength(15, ErrorMessage = "Số điện thoại tối đa 15 ký tự")]
        [RegularExpression(@"^0[1-9]\d{8,9}$", ErrorMessage = "Số điện thoại không hợp lệ")]
        public string SoDienThoai { get; set; } = string.Empty;

        [Required(ErrorMessage = "Địa chỉ chi tiết là bắt buộc")]
        public string DiaChi { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phường/Xã là bắt buộc")]
        public string PhuongXa { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tỉnh/Thành phố là bắt buộc")]
        public string TinhThanh { get; set; } = string.Empty;
    }
}
