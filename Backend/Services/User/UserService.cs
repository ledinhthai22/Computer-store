using Backend.Models;
using Backend.Data;
using Backend.DTO.User;
using Microsoft.EntityFrameworkCore;
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
                .Where(x => x.NgayXoa == null && x.MaVaiTro != 1)
                .Select(d => new UserResult
                {
                    MaNguoiDung = d.MaNguoiDung,
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
                .Where(x => x.TrangThai == false && x.MaVaiTro != 1)
                .Select(d => new UserResult
                {
                    MaNguoiDung = d.MaNguoiDung,
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
                .Where(x => x.TrangThai == true && x.MaVaiTro != 1)
                .Select(d => new UserResult
                {
                    MaNguoiDung = d.MaNguoiDung,
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
                .Where(x => x.NgayXoa != null && x.MaVaiTro != 1)
                .Select(d => new UserResult
                {
                    MaNguoiDung = d.MaNguoiDung,
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
                GioiTinh = true,
                NgaySinh = request.NgaySinh,
                MaVaiTro = 2,
                MatKhauMaHoa = BCrypt.Net.BCrypt.HashPassword(request.MatKhau),
                TrangThai = true,
                NgayTao = DateTime.Now
            };

            _DbContext.NguoiDung.Add(user);
            await _DbContext.SaveChangesAsync();
            await _DbContext.Entry(user)
                .Reference(u => u.VaiTro)
                .LoadAsync();
            return new UserResult
            {
                MaNguoiDung = user.MaNguoiDung,
                HoTen = user.HoTen,
                Email = user.Email,
                NgaySinh = user.NgaySinh ?? DateTime.MinValue,
                GioiTinh = user.GioiTinh,
                SoDienThoai = user.SoDienThoai,
                VaiTro = user.VaiTro.TenVaiTro,
                TrangThai = user.TrangThai,
                Message = "Tạo tài khoản thành công"
            };
        }
        public async Task<bool> LockAsync(int id)
        {
            var user = await _DbContext.NguoiDung.FindAsync(id);
            if (user == null)
            {
                return false;
            }
            user.TrangThai = false;
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
            user.NgayXoa = DateTime.Now;
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
            user.NgayXoa = null;
            await _DbContext.SaveChangesAsync();
            return true;
        }
        public async Task<UserResult?> GetUserInfoAsync(int id)
        {
            var user = await _DbContext.NguoiDung
                .Include(u => u.VaiTro)
                .FirstOrDefaultAsync(u => u.MaNguoiDung == id && u.NgayXoa == null);

            if (user == null)
            {
                return null;
            }

            return new UserResult
            {
                MaNguoiDung = user.MaNguoiDung,
                HoTen = user.HoTen,
                Email = user.Email,
                GioiTinh = user.GioiTinh,
                NgaySinh = user.NgaySinh ?? DateTime.MinValue,
                SoDienThoai = user.SoDienThoai,
                VaiTro = user.VaiTro.TenVaiTro,
                TrangThai = user.TrangThai
            };
        }

        public async Task<UserResult?> UpdateInfoUserAsync(int id, UpdateUserRequest request)
        {
            var user = await _DbContext.NguoiDung
                .Include(u => u.VaiTro)
                .FirstOrDefaultAsync(u => u.MaNguoiDung == id && u.NgayXoa == null);

            if (user == null)
            {
                return null;
            }

            user.HoTen = request.HoTen;
            user.SoDienThoai = request.SoDienThoai;
            user.GioiTinh = request.GioiTinh;
            user.NgaySinh = request.NgaySinh;
            user.NgayCapNhat = DateTime.Now;
            await _DbContext.SaveChangesAsync();

            return new UserResult
            {
                HoTen = user.HoTen,
                Email = user.Email,
                SoDienThoai = user.SoDienThoai,
                GioiTinh = user.GioiTinh,  
                NgaySinh= user.NgayCapNhat,
                TrangThai = user.TrangThai,
                Message = "Cập nhật thông tin người dùng thành công"
            };
        }
        public async Task<UserResult?> ChangePasswordAsync(int id,ChangePasswordRequest request)
        {
            var user = await _DbContext.NguoiDung
                .Include(u => u.VaiTro)
                .FirstOrDefaultAsync(u => u.MaNguoiDung == id && u.NgayXoa == null);

            if (user == null)
                return null;

            bool isOldPasswordCorrect = BCrypt.Net.BCrypt.Verify(request.MatKhauCu,user.MatKhauMaHoa);

            if (!isOldPasswordCorrect)
            {
                return new UserResult
                {
                    Message = "Mật khẩu cũ không đúng"
                };
            }

            if (request.MatKhauCu == request.MatKhauMoi)
            {
                return new UserResult
                {
                    Message = "Mật khẩu mới phải khác mật khẩu cũ"
                };
            }

            user.MatKhauMaHoa = BCrypt.Net.BCrypt.HashPassword(request.MatKhauMoi);
            user.NgayCapNhat = DateTime.Now;

            await _DbContext.SaveChangesAsync();

            return new UserResult
            {
                MaNguoiDung = user.MaNguoiDung,
                HoTen = user.HoTen,
                Email = user.Email,
                TrangThai = user.TrangThai,
                Message = "Đổi mật khẩu thành công"
            };
        }

    }
}
