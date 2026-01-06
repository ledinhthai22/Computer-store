using Backend.DTO.Category;
namespace Backend.Services.Category
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResult>> GetAllAsync();
        Task<IEnumerable<CategoryResult>> GetDeleteListAsync();
        Task<CategoryResult?> GetByIdAsync(int id);
        Task<CategoryResult> CreateAsync(CreateCategoryRequest request);
        Task<CategoryResult?> UpdateAsync(int id, UpdateCategoryRequest request);
        Task<bool> DeleteAsync(int id);
        Task<bool> RecoverAsync(int id);
    }
}