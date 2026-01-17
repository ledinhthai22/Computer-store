using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnsGhiChuToDonHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GhiChu",
                table: "DonHang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$27R9F7n9cDE2C42N4gvQSeXxMGBQtH.619eQL5vcydKtoqsfch8ni", new DateTime(2026, 1, 15, 7, 45, 54, 897, DateTimeKind.Local).AddTicks(2068), new DateTime(2026, 1, 15, 7, 45, 54, 897, DateTimeKind.Local).AddTicks(2050) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GhiChu",
                table: "DonHang");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$8gOKlTn7XttJTqB6zIYsReIurOsoodixZLikakuwH6N2VF4wPU6bu", new DateTime(2026, 1, 14, 19, 52, 47, 855, DateTimeKind.Local).AddTicks(4382), new DateTime(2026, 1, 14, 19, 52, 47, 855, DateTimeKind.Local).AddTicks(4367) });
        }
    }
}
