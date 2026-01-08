using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Cart
{
    public class CartItemRequest
    {
        [Required]
        public int MaNguoiDung { get; set; }
        public int MaBienThe { get; set; }
        public int SoLuong { get; set; }
    }
}
