using Backend.DTO.Search;
using Backend.DTO.Product;
namespace Backend.Services.Search
{
    public interface ISearchService
    {
        Task<SearchResult<SearchUserResult>> SearchProductsUserAsync(SearchUserRequest request);
        Task<SearchResult<SearchAdminResult>> SearchProductsAdminAsync(SearchAdminRequest request);
    }
}
