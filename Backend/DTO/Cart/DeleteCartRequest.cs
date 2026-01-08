using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Cart
{
    public class DeleteCartRequest
    {
        [Required]
        public int MaNguoiDung { get; set; }
        public int MaBienThe { get; set; }
    }
}
