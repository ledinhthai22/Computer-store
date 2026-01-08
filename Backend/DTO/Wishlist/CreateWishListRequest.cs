using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Backend.DTO.WishList
{
    public class CreateWishListRequest 
    {
        [Required]
        public int MaNguoiDung { get; set; }
        public int MaBienThe { get; set; }
    }
}
