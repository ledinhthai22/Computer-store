using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTrangThaiNguoiDungBoolToInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenTaiKhoan",
                table: "NguoiDung");

            migrationBuilder.AlterColumn<int>(
                name: "TrangThai",
                table: "NguoiDung",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao", "TrangThai" },
                values: new object[] { "$2a$11$cHfFv4qAhWk/SOZFEZuom.mZsKrIr2PpSt2gLmuTIuMQ9DAvGZFTe", new DateTime(2026, 1, 5, 13, 5, 36, 420, DateTimeKind.Local).AddTicks(2538), new DateTime(2026, 1, 5, 13, 5, 36, 420, DateTimeKind.Local).AddTicks(2516), 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "TrangThai",
                table: "NguoiDung",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "TenTaiKhoan",
                table: "NguoiDung",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao", "TenTaiKhoan", "TrangThai" },
                values: new object[] { "$2a$11$.WOtuIbf.34eZrATztvRN.6YPktm4csxnT2Xsm7rxFZBjLy9DX4oe", new DateTime(2026, 1, 5, 10, 48, 23, 235, DateTimeKind.Local).AddTicks(3970), new DateTime(2026, 1, 5, 10, 48, 23, 235, DateTimeKind.Local).AddTicks(3950), "admin", true });
        }
    }
}
