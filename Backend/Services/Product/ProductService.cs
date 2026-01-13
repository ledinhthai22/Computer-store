using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTO.Product;
using Backend.Helper;
using Backend.Models;
using Ecommerce.DTO.Common;
using Ecommerce.DTO.Product;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Product
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _DbContext;
        private readonly SlugHelper _SlugHelper;

        public ProductService(ApplicationDbContext DbContext, SlugHelper SlugHelper)
        {
            _DbContext = DbContext;
            _SlugHelper = SlugHelper;
        }
        
      
     
    }
}