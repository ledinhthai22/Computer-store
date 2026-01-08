using Backend.DTO.WebInfo;
using Ecommerce.DTO.WebInfo;
namespace Backend.Services.WebInfo
{
    public interface IWebInfoService
    {
        Task<WebInfoResult> GetAsync();
        Task<List<WebInfoResult>> GetAllHidenAsync();
        Task<bool> SoftDelete(int id);
        Task<WebInfoResult> CreateWebInfo(WebInfoItemRequest request);
        Task<WebInfoResult> UpdateWebInfo(int id,WebInfoItemRequest request);
        Task<bool> RestoreWebInfo(int id);
    }
}
