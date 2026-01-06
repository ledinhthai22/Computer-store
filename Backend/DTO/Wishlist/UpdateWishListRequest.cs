using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.WishList
{
    public class UpdateWishListRequest 
    {
        [Required]
        public int WishListId { get; set; }
       
    }
}
