using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddInfoNhanHangToDonHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DiaChi",
                table: "DonHang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GhiChuNoiBo",
                table: "DonHang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NguoiNhan",
                table: "DonHang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhuongXa",
                table: "DonHang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SoDienThoaiNguoiNhan",
                table: "DonHang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TinhThanh",
                table: "DonHang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$N5j/mSeF9bzGIVDUCmho7OIimcIN07kVM5x/D2kKHbMl2n39hNJSi", new DateTime(2026, 1, 17, 1, 7, 16, 719, DateTimeKind.Local).AddTicks(1281), new DateTime(2026, 1, 17, 1, 7, 16, 719, DateTimeKind.Local).AddTicks(1264) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiaChi",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "GhiChuNoiBo",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "NguoiNhan",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "PhuongXa",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "SoDienThoaiNguoiNhan",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "TinhThanh",
                table: "DonHang");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$VoK/RgVTGAdpUhoDKRoTR.QewJ4CnT1Se811LbWRM3PSg9soW2OZW", new DateTime(2026, 1, 15, 10, 23, 45, 460, DateTimeKind.Local).AddTicks(1709), new DateTime(2026, 1, 15, 10, 23, 45, 460, DateTimeKind.Local).AddTicks(1692) });
        }
    }
}
