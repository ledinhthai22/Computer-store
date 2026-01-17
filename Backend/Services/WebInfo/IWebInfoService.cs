using Backend.DTO.WebInfo;
using Ecommerce.DTO.WebInfo;
namespace Backend.Services.WebInfo
{
    public interface IWebInfoService
    {
        Task<WebInfoResult> GetActiveAsync();
        Task<List<WebInfoResult>> GetAllAsync();
        Task<List<WebInfoResult>> GetAllHidenAsync();
        Task<bool> SoftDelete(int id);
        Task<WebInfoResult> CreateWebInfo(WebInfoItemRequest request);
        Task<WebInfoResult> UpdateWebInfo(int id, WebInfoItemRequest request);
        Task<bool> RestoreWebInfo(int id);
        Task<bool> UpdateStatus(int id);
        Task<WebInfoResult> GetDetailAsync(int id);
    }
}
