using Backend.DTO;
using Backend.Models;
using Backend.Data;
using Backend.Helper;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Backend.DTO.Auth;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Backend.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _Dbcontext;
        private readonly JwtHelper _jwtHelper;

        public AuthService(ApplicationDbContext Dbcontext, JwtHelper jwtHelper)
        {
            _Dbcontext = Dbcontext;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResult> LoginAsync(LoginRequest req)
        {

            var user = await _Dbcontext.NguoiDung
          .AsNoTracking()
          .Where(u => u.Email == req.Email)
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
                isPasswordValid = BCrypt.Net.BCrypt.Verify(req.MatKhau, user.MatKhauMaHoa);
            }
            catch
            {
                if (user.MatKhauMaHoa == req.MatKhau) isPasswordValid = true;
            }

            if (!isPasswordValid)
            {
                return new AuthResult { Success = false, Message = "Mật khẩu không chính xác." };
            }


            if (user.TrangThai == 2)
            {
                return new AuthResult { Success = false, Message = "Tài khoản đã bị khóa." };
            }


            var token = _jwtHelper.GenerateToken(user.MaNguoiDung, user.TenVaiTro);


            return new AuthResult
            {
                Success = true,
                Message = "Đăng nhập thành công",
                Token = token,
                HoTen = user.HoTen,
                VaiTro = user.TenVaiTro
            };
        }
        public async Task<AuthResult> RegisterAsync(RegisterRequest req)
        {
            
            var existed = await _Dbcontext.NguoiDung
                .FirstOrDefaultAsync(x => x.Email == req.Email);

            if (existed != null)
            {
                return new AuthResult
                {
                    Success = false,
                    Message = "Email đã tồn tại"
                };
            }

            
            string hashPassWord = BCrypt.Net.BCrypt.HashPassword(req.MatKhau);

            
            var user = new NguoiDung
            {
                HoTen = req.HoTen,
                Email = req.Email,
                SoDienThoai = req.SoDienThoai,
                MatKhauMaHoa = hashPassWord,
                TrangThai = 1,
                MaVaiTro = 2, 
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            
            _Dbcontext.NguoiDung.Add(user);
            await _Dbcontext.SaveChangesAsync();  

            
            var vaiTro = await _Dbcontext.VaiTro
                .FirstOrDefaultAsync(r => r.MaVaiTro == user.MaVaiTro);

            string tenVaiTro = vaiTro?.TenVaiTro ?? "NguoiDung";

            
            var token = _jwtHelper.GenerateToken(user.MaNguoiDung, tenVaiTro);

            
            return new AuthResult
            {
                Success = true,
                Message = "Đăng ký thành công",
                Token = token,
                HoTen = user.HoTen,
                VaiTro = tenVaiTro
            };
        }

    }
}