using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.WishList
{
    public class WishlistResult 
    {
        public int WishlistId { get; set; }
        public int UserId { get; set; }
        public int ProductVariantID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string HinhAnhChinh { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
}
