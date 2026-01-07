namespace Backend.DTO.Cart
{
    public class CartRequest
    {
        public int UserId { get; set; }
        public int VariantId { get; set; }
        public int Quantity { get; set; }
    }
}
