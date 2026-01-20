using Ecommerce.DTO.SlideShow;

namespace Ecommerce.Services.SlideShow
{
    public interface ISlideShowService
    {
        Task<List<SlideShowResult>> GetAllAsync();
        Task<List<SlideShowResult>> GetAllAdminAsync();
        Task<SlideShowResult?> GetByIdAsync(int id);
        Task<bool> CreateAsync(SlideShowCreate request);
        Task<bool> UpdateAsync(int id, UpdateSlideShow request);
        Task<bool> DeleteAsync(int id);
    }
}