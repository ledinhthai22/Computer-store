using Backend.DTO.Brand;
using Backend.DTO.Category;
using Backend.DTO.Product;
namespace Backend.Services.Brand
{
    public interface IBrandService
    {
        Task<IEnumerable<BrandResult>>GetAllAsync();
        Task<IEnumerable<BrandResult>> GetAllHidenAsync();
        Task<BrandResult?> GetByIdAsync(int id);
        Task<BrandResult> CreateAsync(CreateBrandRequest request);
        Task<BrandResult?> UpdateAsync(int id, UpdateBrandRequest request);
        Task<bool> DeleteAsync(int id);
        Task<bool> RestoreAsync(int id);
        Task<List<ProductResult>> GetProductByBrand(int MaBrand);
    }
}