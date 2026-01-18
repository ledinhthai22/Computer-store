using Backend.DTO.WebInfo;
using Ecommerce.DTO.WebInfo;

namespace Backend.Services.WebInfo
{
    public interface IWebInfoService
    {
        // Client
        Task<Dictionary<string, string?>> GetForClientAsync();

        // Admin
        Task<List<WebInfoResult>> GetForAdminAsync();
        Task<List<WebInfoResult>> GetDeletedAsync();

        // CRUD
        Task CreateAsync(WebInfoCreate request);
        Task<WebInfoResult?> UpdateAsync(int id, WebInfoUpdate request);
        Task DeleteAsync(int id);
        Task RestoreAsync(int id);
    }
}
