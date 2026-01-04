using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class Update_TableAddCollunmStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "TrangThai",
                table: "DanhMuc",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$DYzcURHQ8XI.PwtapyLdk.njsQpnssZY1f5l/lHZQ14PrFu6CUuaG", new DateTime(2026, 1, 4, 17, 59, 58, 801, DateTimeKind.Local).AddTicks(171), new DateTime(2026, 1, 4, 17, 59, 58, 801, DateTimeKind.Local).AddTicks(145) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "DanhMuc");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$BWRltWrH2Wr44M3qErJ9hOMWX5VCLbM6pAP0Gs8GE93a4NHgQBTm.", new DateTime(2026, 1, 4, 17, 55, 18, 97, DateTimeKind.Local).AddTicks(3288), new DateTime(2026, 1, 4, 17, 55, 18, 97, DateTimeKind.Local).AddTicks(3268) });
        }
    }
}
