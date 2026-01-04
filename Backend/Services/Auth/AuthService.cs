using Backend.DTO;
using Backend.Models;
using Backend.Data;
using Backend.Helper;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Backend.DTO.Auth;

namespace Backend.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(ApplicationDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResult> LoginAsync(LoginRequest request)
        {

            var user = await _context.NguoiDung
          .AsNoTracking()
          .Where(u => u.TenTaiKhoan == request.TenTaiKhoan || u.Email == request.TenTaiKhoan)
          .Select(u => new
          {

              u.MaNguoiDung,
              u.MatKhauMaHoa,
              u.HoTen,
              u.TrangThai,

              TenVaiTro = u.VaiTro.TenVaiTro
          })
          .FirstOrDefaultAsync();


            if (user == null)
            {
                return new AuthResult { Success = false, Message = "Tài khoản không tồn tại." };
            }

            bool isPasswordValid = false;
            try
            {
                isPasswordValid = BCrypt.Net.BCrypt.Verify(request.MatKhau, user.MatKhauMaHoa);
            }
            catch
            {
                if (user.MatKhauMaHoa == request.MatKhau) isPasswordValid = true;
            }

            if (!isPasswordValid)
            {
                return new AuthResult { Success = false, Message = "Mật khẩu không chính xác." };
            }

            // 4. Check trạng thái
            if (user.TrangThai == false)
            {
                return new AuthResult { Success = false, Message = "Tài khoản đã bị khóa." };
            }

            // 5. Tạo Token
            var token = _jwtHelper.GenerateToken(user.MaNguoiDung, user.TenVaiTro);

            // 6. Trả về kết quả
            return new AuthResult
            {
                Success = true,
                Message = "Đăng nhập thành công",
                Token = token,
                HoTen = user.HoTen,
                Role = user.TenVaiTro
            };
        }
    }
}