using System.ComponentModel.DataAnnotations;

namespace Backend.DTO.Cart
{
    public class DeleteCartRequest
    {
        [Required]
        public int UserId { get; set; }
        public int VariantId { get; set; }
    }
}
