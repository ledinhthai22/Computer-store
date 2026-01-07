using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Cart
{
    public class CartItemRequest
    {
        [Required]
        public int UserId { get; set; }
        public int VariantId { get; set; }
        public int Quantity { get; set; }
    }
}
