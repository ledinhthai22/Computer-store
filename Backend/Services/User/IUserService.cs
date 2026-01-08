
using Backend.DTO.User;

namespace Backend.Services.User
{
    public interface IUserService
    {
        Task<IEnumerable<UserResult>> GetAllAsync();
        Task<IEnumerable<UserResult>> GetLockListAsync();
        Task<IEnumerable<UserResult>> GetUnLockListAsync();
        Task<IEnumerable<UserResult>> GetDeleteListAsync();
        Task<UserResult?> GetUserInfoAsync(int id);
        Task<UserResult?>UpdateUserAsync(int id,UpdateUserRequest request);
        Task<UserResult?> CreateAsync(CreateUserRequest request);
        Task<UserResult?> UpdateAdminAsync(int id, UpdateUserRequest request);
        Task<bool> DeleteAsync(int id);
        Task<bool> RestoreAsync(int id);
        Task<bool> LockAsync(int id);
        Task<bool> UnLockAsync(int id);
    }
}