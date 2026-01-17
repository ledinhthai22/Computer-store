using Backend.Models;
using Ecommerce.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<VaiTro> VaiTro { get; set; } = null!;
        public DbSet<NguoiDung> NguoiDung { get; set; } = null!;
        public DbSet<DanhMuc> DanhMuc { get; set; } = null!;
        public DbSet<ThuongHieu> ThuongHieu { get; set; } = null!;
        public DbSet<ThongSoKyThuat> ThongSoKyThuat { get; set; } = null!;
        public DbSet<SanPham> SanPham { get; set; } = null!;
        public DbSet<BienThe> BienThe { get; set; } = null!;
        public DbSet<HinhAnhSanPham> HinhAnhSanPham { get; set; } = null!;
        public DbSet<YeuThich> YeuThich { get; set; } = null!;
        public DbSet<ChiTietGioHang> ChiTietGioHang { get; set; } = null!;
        public DbSet<DiaChiNhanHang> DiaChiNhanHang { get; set; } = null!;
        public DbSet<DanhGia> DanhGia { get; set; } = null!;
        public DbSet<DonHang> DonHang { get; set; } = null!;
        public DbSet<ChiTietDonHang> ChiTietDonHang { get; set; } = null!;
        public DbSet<LienHe> LienHe { get; set; } = null!;
        public DbSet<TrinhChieu> TrinhChieu { get; set; } = null!;
        public DbSet<ThongTinTrang> ThongTinTrang { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<NguoiDung>()
                .HasOne(nd => nd.VaiTro)
                .WithMany(vt => vt.NguoiDung) 
                .HasForeignKey(nd => nd.MaVaiTro)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SanPham>()
                .HasOne(s => s.DanhMuc)
                .WithMany(dm => dm.SanPham)
                .HasForeignKey(s => s.MaDanhMuc);

            modelBuilder.Entity<SanPham>()
                .HasOne(s => s.ThuongHieu)
                .WithMany(th => th.SanPham)
                .HasForeignKey(s => s.MaThuongHieu);

          
            modelBuilder.Entity<SanPham>()
                .HasOne(s => s.ThongSoKyThuat)
                .WithOne(ts => ts.SanPham)
                .HasForeignKey<SanPham>(s => s.MaThongSo);

            
            modelBuilder.Entity<DanhGia>()
                .HasOne(d => d.SanPham)
                .WithMany(s => s.DanhGia)
                .HasForeignKey(d => d.MaSanPham)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DanhGia>()
                .HasOne(d => d.NguoiDung)
                .WithMany(nd => nd.DanhGia)
                .HasForeignKey(d => d.MaNguoiDung) 
                .OnDelete(DeleteBehavior.Restrict);

            
            modelBuilder.Entity<BienThe>()
                .HasOne(bt => bt.SanPham)
                .WithMany(sp => sp.BienThe)
                .HasForeignKey(bt => bt.MaSanPham)
                .OnDelete(DeleteBehavior.Cascade);

           
            //modelBuilder.Entity<HinhAnhSanPham>()
            //    .HasOne(h => h.BienThe)
            //    .WithMany(bt => bt.HinhAnhSanPham)
            //    .HasForeignKey(h => h.MaBienThe)
            //    .OnDelete(DeleteBehavior.Cascade);

         
            modelBuilder.Entity<YeuThich>()
                .HasOne(y => y.NguoiDung)
                .WithMany(nd => nd.YeuThich)
                .HasForeignKey(y => y.MaNguoiDung)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<YeuThich>()
                .HasOne(y => y.BienThe)
                .WithMany(bt => bt.YeuThich) 
                .HasForeignKey(y => y.MaBienThe)
                .OnDelete(DeleteBehavior.Cascade);

            
            modelBuilder.Entity<ChiTietGioHang>()
                .HasKey(c => new { c.MaNguoiDung, c.MaBienThe });

            modelBuilder.Entity<ChiTietGioHang>()
                .HasOne(c => c.NguoiDung)
                .WithMany(nd => nd.ChiTietGioHang)
                .HasForeignKey(c => c.MaNguoiDung);

            modelBuilder.Entity<ChiTietGioHang>()
                .HasOne(c => c.BienThe)
                .WithMany(bt => bt.ChiTietGioHang)
                .HasForeignKey(c => c.MaBienThe);

      
            modelBuilder.Entity<DiaChiNhanHang>()
                .HasOne(dc => dc.NguoiDung) 
                .WithMany(nd => nd.DiaChiNhanHang)
                .HasForeignKey(dc => dc.MaNguoiDung);
            
         
            modelBuilder.Entity<DonHang>()
                .HasOne(dh => dh.KhachHang)
                .WithMany(kh => kh.DonHang)
                .HasForeignKey(dh => dh.MaKH)
                .OnDelete(DeleteBehavior.Restrict);

            //modelBuilder.Entity<DonHang>()
            //    .HasOne(dh => dh.BienThe)
            //    .WithMany(bt => bt.DonHang)
            //    .HasForeignKey(dh => dh.MaBienThe)
            //    .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<ChiTietDonHang>()
                .HasKey(ct => new { ct.MaDonHang, ct.MaBienThe });

            modelBuilder.Entity<ChiTietDonHang>()
                .HasOne(ct => ct.DonHang)
                .WithMany(dh => dh.ChiTietDonHang) 
                .HasForeignKey(ct => ct.MaDonHang)
                .OnDelete(DeleteBehavior.Cascade); 

            
            modelBuilder.Entity<ChiTietDonHang>()
                .HasOne(ct => ct.BienThe)
                .WithMany() 
                .HasForeignKey(ct => ct.MaBienThe)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VaiTro>().HasData(
                new VaiTro { MaVaiTro = 1, TenVaiTro = "QuanTriVien" },
                new VaiTro { MaVaiTro = 2, TenVaiTro = "NguoiDung" }
            );

            // Cần cài thư viện BCrypt.Net-Next để dùng hàm HashPassword
            modelBuilder.Entity<NguoiDung>().HasData(
                new NguoiDung
                {
                    MaNguoiDung = 1,
                    MaVaiTro = 1,
                    HoTen = "Quản trị viên",
                    MatKhauMaHoa = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Email = "admin@gmail.com",
                    SoDienThoai = "0999988884",
                    TrangThai = true,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                }
            );
        }
    }
}