using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class changRelationShipAndChangeHinhAnhSanPham : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayXoa",
                table: "HinhAnhSanPham",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$FCZbCdaOKqaK/w0EfR798u.jiXTCbDkOPFaYVuD8paXjOVA0aylUe", new DateTime(2026, 1, 12, 21, 5, 4, 135, DateTimeKind.Local).AddTicks(9324), new DateTime(2026, 1, 12, 21, 5, 4, 135, DateTimeKind.Local).AddTicks(9305) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayXoa",
                table: "HinhAnhSanPham",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$FiJxXYrbaGM8jVP/V7nw0uvyFm02Dmyesjxz3jfaq7EQf6sFDKb9W", new DateTime(2026, 1, 12, 21, 1, 35, 318, DateTimeKind.Local).AddTicks(5005), new DateTime(2026, 1, 12, 21, 1, 35, 318, DateTimeKind.Local).AddTicks(4980) });
        }
    }
}
