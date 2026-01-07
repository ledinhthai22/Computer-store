using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTO.Product;

namespace Backend.Services.Product
{
    public interface IProductService
    {
        Task<ProductResult?> CreateAsync(CreateProductRequest request);
        Task<IEnumerable<ProductResult>> GetAllAsync();
        Task<ProductResult?> GetByIdAsync(int id);
    }
}