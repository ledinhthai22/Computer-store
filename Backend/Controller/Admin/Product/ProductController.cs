using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTO.Product;
using Backend.Services.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller.Admin.Product
{
    public class ProductController : ControllerBase
    {
        private readonly IProductService _IProductService;
        public ProductController (IProductService IProductService)
        {
            _IProductService = IProductService;
        }
        [HttpPost]
        [Authorize("QuanTriVien")]
        public async Task<IActionResult> CreateAsync (CreateProductRequest request)
        {
            return Ok();
        }
    }
}