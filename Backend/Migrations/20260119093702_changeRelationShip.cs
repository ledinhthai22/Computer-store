using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class changeRelationShip : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_YeuThich_BienThe_MaBienThe",
                table: "YeuThich");

            migrationBuilder.RenameColumn(
                name: "MaBienThe",
                table: "YeuThich",
                newName: "MaSanPham");

            migrationBuilder.RenameIndex(
                name: "IX_YeuThich_MaBienThe",
                table: "YeuThich",
                newName: "IX_YeuThich_MaSanPham");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$DT9CddSYKZpLjeo6KdnEPe8ShPQCPxTvy.2Rti1VKbYaVrFyJv9Ye", new DateTime(2026, 1, 19, 16, 37, 1, 167, DateTimeKind.Local).AddTicks(4604), new DateTime(2026, 1, 19, 16, 37, 1, 167, DateTimeKind.Local).AddTicks(4583) });

            migrationBuilder.AddForeignKey(
                name: "FK_YeuThich_SanPham_MaSanPham",
                table: "YeuThich",
                column: "MaSanPham",
                principalTable: "SanPham",
                principalColumn: "MaSanPham",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_YeuThich_SanPham_MaSanPham",
                table: "YeuThich");

            migrationBuilder.RenameColumn(
                name: "MaSanPham",
                table: "YeuThich",
                newName: "MaBienThe");

            migrationBuilder.RenameIndex(
                name: "IX_YeuThich_MaSanPham",
                table: "YeuThich",
                newName: "IX_YeuThich_MaBienThe");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$XZ4QDRAM5jmkOPmVZKtrNeti5L/XWZ0qMI4vhhckn3VTgBCx02biu", new DateTime(2026, 1, 19, 9, 12, 16, 367, DateTimeKind.Local).AddTicks(2462), new DateTime(2026, 1, 19, 9, 12, 16, 367, DateTimeKind.Local).AddTicks(2434) });

            migrationBuilder.AddForeignKey(
                name: "FK_YeuThich_BienThe_MaBienThe",
                table: "YeuThich",
                column: "MaBienThe",
                principalTable: "BienThe",
                principalColumn: "MaBTSP",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
