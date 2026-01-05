using Backend.DTO.Category;
namespace Backend.Services.Category
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResult>> GetAllAsync();
        Task<CategoryResult?> GetByIdAsync(int id);
        Task<CategoryResult> CreateAsync(CreateCategoryRequest request);
        Task<CategoryResult?> UpdateAsync(int id, UpdateCategoryRequest request);
        Task<bool> DeleteAsync(int id);
    }
}