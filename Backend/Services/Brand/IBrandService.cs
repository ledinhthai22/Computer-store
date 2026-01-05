using Backend.DTO.Category;
using Backend.DTO.Brand;
namespace Backend.Services.Brand
{
    public interface IBrandService
    {
        Task<IEnumerable<BrandResult>>GetAllAsync();
        Task<BrandResult?> GetByIdAsync(int id);
        Task<BrandResult> CreateAsync(CreateBrandRequest request);
        Task<BrandResult?> UpdateAsync(int id, UpdateBrandRequest request);
        Task<bool> DeleteAsync(int id);
    }
}