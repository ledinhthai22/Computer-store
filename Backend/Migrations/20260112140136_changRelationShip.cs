using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class changRelationShip : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HinhAnhSanPham_BienThe_MaBienThe",
                table: "HinhAnhSanPham");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayXoa",
                table: "HinhAnhSanPham",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$FiJxXYrbaGM8jVP/V7nw0uvyFm02Dmyesjxz3jfaq7EQf6sFDKb9W", new DateTime(2026, 1, 12, 21, 1, 35, 318, DateTimeKind.Local).AddTicks(5005), new DateTime(2026, 1, 12, 21, 1, 35, 318, DateTimeKind.Local).AddTicks(4980) });

            migrationBuilder.AddForeignKey(
                name: "FK_HinhAnhSanPham_SanPham_MaBienThe",
                table: "HinhAnhSanPham",
                column: "MaBienThe",
                principalTable: "SanPham",
                principalColumn: "MaSanPham",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HinhAnhSanPham_SanPham_MaBienThe",
                table: "HinhAnhSanPham");

            migrationBuilder.DropColumn(
                name: "NgayXoa",
                table: "HinhAnhSanPham");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$/blTRp9qfpvl4ffeYgul2OFNxU69BrXD/c.O8zXXH1c/t7IDmE23a", new DateTime(2026, 1, 11, 22, 3, 32, 405, DateTimeKind.Local).AddTicks(47), new DateTime(2026, 1, 11, 22, 3, 32, 405, DateTimeKind.Local).AddTicks(30) });

            migrationBuilder.AddForeignKey(
                name: "FK_HinhAnhSanPham_BienThe_MaBienThe",
                table: "HinhAnhSanPham",
                column: "MaBienThe",
                principalTable: "BienThe",
                principalColumn: "MaBTSP",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
