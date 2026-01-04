using Backend.Models;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<VaiTro> VaiTro{ get; set; } = null!;
        public DbSet<NguoiDung> NguoiDung { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            
            modelBuilder.Entity<NguoiDung>()
                .HasOne(nd => nd.Vaitro)
                .WithMany(vt => vt.Nguoidung)
                .HasForeignKey(nd => nd.maVaiTro)
                .OnDelete(DeleteBehavior.Restrict);

            
            modelBuilder.Entity<VaiTro>().HasData(
                new VaiTro
                {
                    maVaiTro = 1,
                    tenVaiTro = "QuanTriVien"
                },
                new VaiTro
                {
                    maVaiTro = 2,
                    tenVaiTro = "NguoiDung"
                }
            );

           
            modelBuilder.Entity<NguoiDung>().HasData(
                new NguoiDung
                {
                    maNguoiDung = 1,
                    maVaiTro = 1,
                    hoTen = "Quản trị viên",
                    tenTaiKhoan = "admin",
                    matKhauMaHoa = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    email = "admin@gmail.com",
                    soDienThoai = "0123456789",
                    trangThai = true,
                    ngayTao = DateTime.Now,
                    ngayCapNhat = DateTime.Now
                }
            );
        }
    }
}
