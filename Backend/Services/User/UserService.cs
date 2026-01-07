using Backend.Models;
using Backend.Data;
using Backend.DTO.User;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
namespace Backend.Services.User
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _DbContext;
        public UserService(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }
        public async Task<IEnumerable<UserResult>> GetAllAsync()
        {
            return await _DbContext.NguoiDung
                .Include(r => r.VaiTro)
                .Where(x => x.Delete_At == null)
                .Select(d => new UserResult
                {
                    HoTen = d.HoTen,
                    Email = d.Email,
                    SoDienThoai = d.SoDienThoai,
                    TrangThai = d.TrangThai,
                    VaiTro = d.VaiTro.TenVaiTro
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<UserResult>> GetLockListAsync()
        {
            return await _DbContext.NguoiDung
                .Include(r => r.VaiTro)
                .Where(x => x.TrangThai == false)
                .Select(d => new UserResult
                {
                    HoTen = d.HoTen,
                    Email = d.Email,
                    SoDienThoai = d.SoDienThoai,
                    TrangThai = d.TrangThai,
                    VaiTro = d.VaiTro.TenVaiTro
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<UserResult>> GetUnLockListAsync()
        {
            return await _DbContext.NguoiDung
                .Include(r => r.VaiTro)
                .Where(x => x.TrangThai == true)
                .Select(d => new UserResult
                {
                    HoTen = d.HoTen,
                    Email = d.Email,
                    SoDienThoai = d.SoDienThoai,
                    TrangThai = d.TrangThai,
                    VaiTro = d.VaiTro.TenVaiTro
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<UserResult>> GetDeleteListAsync()
        {
            return await _DbContext.NguoiDung
                .Include(r => r.VaiTro)
                .Where(x => x.Delete_At != null)
                .Select(d => new UserResult
                {
                    HoTen = d.HoTen,
                    Email = d.Email,
                    SoDienThoai = d.SoDienThoai,
                    TrangThai = d.TrangThai,
                    VaiTro = d.VaiTro.TenVaiTro
                })
                .ToListAsync();
        }
        public async Task<UserResult?> CreateAsync(CreateUserRequest request)
        {
            var EmailExist = await _DbContext.NguoiDung.AnyAsync(u => u.Email == request.Email);
            if (EmailExist)
            {
                throw new Exception("Email tạo tài khoản đã tồn tồn");
            }
            var user = new NguoiDung
            {
                HoTen = request.HoTen,
                Email = request.Email,
                SoDienThoai = request.SoDienThoai,
                MaVaiTro = 1,
                MatKhauMaHoa = BCrypt.Net.BCrypt.HashPassword(request.MatKhau),
                TrangThai = true,
                NgayTao = DateTime.Now
            };

            _DbContext.NguoiDung.Add(user);
            await _DbContext.SaveChangesAsync();
            return new UserResult
            {
                MaNguoiDung = user.MaNguoiDung,
                HoTen = user.HoTen,
                Email = user.Email,
                SoDienThoai = user.SoDienThoai,
                VaiTro = user.VaiTro.TenVaiTro,
                TrangThai = user.TrangThai,
                Message = "Tạo tài khoản thành công"
            };
        }
        public async Task<UserResult?> UpdateAdminAsync(int id, UpdateUserRequest request)
        {
            var user = await _DbContext.NguoiDung.FindAsync(id);
            if (user == null)
            {
                return null;
            }

            user.HoTen = request.HoTen;
            user.SoDienThoai = request.SoDienThoai;
            user.MaVaiTro = request.MaVaiTro;
            user.NgayCapNhat = DateTime.Now;
            await _DbContext.SaveChangesAsync();
            return new UserResult
            {
                MaNguoiDung = user.MaNguoiDung,
                HoTen = user.HoTen,
                Email = user.Email,
                SoDienThoai = user.SoDienThoai,
                VaiTro = user.VaiTro.TenVaiTro,
                TrangThai = user.TrangThai,
                Message = "Cập nhật tài khoản thành công"
            };
        }
        public async Task<bool> LockAsync(int id)
        {
            var user = await _DbContext.NguoiDung.FindAsync(id);
            if (user == null)
            {
                return false;
            }
            user.TrangThai = true;
            await _DbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UnLockAsync(int id)
        {
            var user = await _DbContext.NguoiDung.FindAsync(id);
            if (user == null)
            {
                return false;
            }
            user.TrangThai = true;
            await _DbContext.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _DbContext.NguoiDung.FindAsync(id);
            if (user == null)
            {
                return false;
            }
            user.Delete_At = DateTime.Now;
            await _DbContext.SaveChangesAsync();
            return true;
        }
        public async Task<bool> RestoreAsync(int id)
        {
            var user = await _DbContext.NguoiDung.FindAsync(id);
            if (user == null)
            {
                return false;
            }
            user.Delete_At = null;
            await _DbContext.SaveChangesAsync();
            return true;
        }
        public async Task<UserResult?> GetUserInfoAsync(int id)
        {
            var user = await _DbContext.NguoiDung
                .Include(u => u.VaiTro)
                .FirstOrDefaultAsync(u => u.MaNguoiDung == id && u.Delete_At == null);

            if (user == null)
            {
                return null;
            }

            return new UserResult
            {
                MaNguoiDung = user.MaNguoiDung,
                HoTen = user.HoTen,
                Email = user.Email,
                SoDienThoai = user.SoDienThoai,
                VaiTro = user.VaiTro.TenVaiTro,
                TrangThai = user.TrangThai
            };
        }

        public async Task<UserResult?> UpdateUserAsync(int id, UpdateUserRequest request)
        {
            var user = await _DbContext.NguoiDung
                .Include(u => u.VaiTro)
                .FirstOrDefaultAsync(u => u.MaNguoiDung == id && u.Delete_At == null);

            if (user == null)
            {
                return null;
            }

            user.HoTen = request.HoTen;
            user.SoDienThoai = request.SoDienThoai;
            user.NgayCapNhat = DateTime.Now;
            await _DbContext.SaveChangesAsync();

            return new UserResult
            {
                HoTen = user.HoTen,
                Email = user.Email,
                SoDienThoai = user.SoDienThoai,
                TrangThai = user.TrangThai,
                Message = "Cập nhật thông tin người dùng thành công"
            };
        }
    }
}
