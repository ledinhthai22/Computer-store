using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnsTongTienGocToDonHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TongTienGoc",
                table: "DonHang",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$VoK/RgVTGAdpUhoDKRoTR.QewJ4CnT1Se811LbWRM3PSg9soW2OZW", new DateTime(2026, 1, 15, 10, 23, 45, 460, DateTimeKind.Local).AddTicks(1709), new DateTime(2026, 1, 15, 10, 23, 45, 460, DateTimeKind.Local).AddTicks(1692) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TongTienGoc",
                table: "DonHang");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$27R9F7n9cDE2C42N4gvQSeXxMGBQtH.619eQL5vcydKtoqsfch8ni", new DateTime(2026, 1, 15, 7, 45, 54, 897, DateTimeKind.Local).AddTicks(2068), new DateTime(2026, 1, 15, 7, 45, 54, 897, DateTimeKind.Local).AddTicks(2050) });
        }
    }
}
