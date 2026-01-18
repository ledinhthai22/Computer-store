using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTableWebInFo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChinhSachBaoMat",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "ChinhSachDoiTra",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "DiaChi",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "DieuKhoanSuDung",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "DuongDanAn",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "DuongDanFacebook",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "DuongDanInstagram",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "DuongDanYoutube",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "SoDienThoai",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "ThongTinTrang");

            migrationBuilder.RenameColumn(
                name: "TenTrang",
                table: "ThongTinTrang",
                newName: "TenKhoaCaiDat");

            migrationBuilder.RenameColumn(
                name: "MaThongTin",
                table: "ThongTinTrang",
                newName: "MaThongTinTrang");

            migrationBuilder.AddColumn<string>(
                name: "GiaTriCaiDat",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MoTa",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayCapNhat",
                table: "ThongTinTrang",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$PpKRuqavxNRX/F6//2sBe.HJ.pK9F.Lzs4l/DLJnmvDzeUmHg4q1S", new DateTime(2026, 1, 18, 19, 47, 2, 922, DateTimeKind.Local).AddTicks(2376), new DateTime(2026, 1, 18, 19, 47, 2, 922, DateTimeKind.Local).AddTicks(2353) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GiaTriCaiDat",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "MoTa",
                table: "ThongTinTrang");

            migrationBuilder.DropColumn(
                name: "NgayCapNhat",
                table: "ThongTinTrang");

            migrationBuilder.RenameColumn(
                name: "TenKhoaCaiDat",
                table: "ThongTinTrang",
                newName: "TenTrang");

            migrationBuilder.RenameColumn(
                name: "MaThongTinTrang",
                table: "ThongTinTrang",
                newName: "MaThongTin");

            migrationBuilder.AddColumn<string>(
                name: "ChinhSachBaoMat",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChinhSachDoiTra",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DiaChi",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DieuKhoanSuDung",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DuongDanAn",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DuongDanFacebook",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DuongDanInstagram",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DuongDanYoutube",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SoDienThoai",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "TrangThai",
                table: "ThongTinTrang",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$fUKRIv8julyZw3GGtqGR8eTgEjZTqxuAH2gufNXAu6xQ4pCGBFwCi", new DateTime(2026, 1, 17, 17, 54, 2, 426, DateTimeKind.Local).AddTicks(1755), new DateTime(2026, 1, 17, 17, 54, 2, 426, DateTimeKind.Local).AddTicks(1738) });
        }
    }
}
