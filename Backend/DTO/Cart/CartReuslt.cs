using Microsoft.AspNetCore.Mvc;

namespace Backend.DTO.Cart
{
    public class CartReuslt 
    { 
        public int UserId { get; set; }
        public int VariantId { get; set; }
        public int Quantity { get; set; }
        public string VariantName { get; set; }
        public string ImageUrl { get; set; }
        public string Price { get; set; }
        public string DiscountPrice { get; set; }
    }
}
