using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class Update_DataTypePriceProductAndprototype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "KhuyenMai",
                table: "SanPham",
                type: "float",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<decimal>(
                name: "GiaCoBan",
                table: "SanPham",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AlterColumn<double>(
                name: "DanhGiaTrungBinh",
                table: "SanPham",
                type: "float",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$UM9vKn.1k44fe/5WoObvUuE/pN7dQ8fw1xxdBOrMz.yF66RmlwMVO", new DateTime(2026, 1, 4, 18, 47, 16, 481, DateTimeKind.Local).AddTicks(8098), new DateTime(2026, 1, 4, 18, 47, 16, 481, DateTimeKind.Local).AddTicks(8076) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "KhuyenMai",
                table: "SanPham",
                type: "real",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<float>(
                name: "GiaCoBan",
                table: "SanPham",
                type: "real",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<float>(
                name: "DanhGiaTrungBinh",
                table: "SanPham",
                type: "real",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$9sfEDAetaUi0Jd.JXpmEveFHv.D.Piq4c/S98M0tKnql70D56i8au", new DateTime(2026, 1, 4, 18, 34, 36, 633, DateTimeKind.Local).AddTicks(8741), new DateTime(2026, 1, 4, 18, 34, 36, 633, DateTimeKind.Local).AddTicks(8721) });
        }
    }
}
