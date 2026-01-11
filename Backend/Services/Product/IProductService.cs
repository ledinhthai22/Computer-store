using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTO.Product;
using Ecommerce.DTO.Common;

namespace Backend.Services.Product
{
    public interface IProductService
    {
        Task<ProductResult?> CreateAsync(CreateProductRequest request);
        Task<IEnumerable<ProductResult>> GetAllAsync();
        Task<ProductResult?> GetByIdAsync(int id);
        Task<PagedResult<ProductResult>> GetProductByCategoryAsync(string slug,int page,int pageSize);
    }
}