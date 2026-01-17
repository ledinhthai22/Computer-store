using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class Fix_OneToOne_BienThe_ThongSo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BienThe_ThongSoKyThuat_MaThongSo",
                table: "BienThe");

            migrationBuilder.DropForeignKey(
                name: "FK_ThongSoKyThuat_SanPham_SanPhamMaSanPham",
                table: "ThongSoKyThuat");

            migrationBuilder.DropIndex(
                name: "IX_ThongSoKyThuat_SanPhamMaSanPham",
                table: "ThongSoKyThuat");

            migrationBuilder.DropIndex(
                name: "IX_BienThe_MaThongSo",
                table: "BienThe");

            migrationBuilder.DropColumn(
                name: "SanPhamMaSanPham",
                table: "ThongSoKyThuat");

            migrationBuilder.DropColumn(
                name: "MaThongSo",
                table: "BienThe");

            migrationBuilder.AddColumn<int>(
                name: "MaBienThe",
                table: "ThongSoKyThuat",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$KHI1PAX22E/30.F47ibOXurymEnzg6qEGjUOQHSLCToCzAh9AsnRy", new DateTime(2026, 1, 13, 8, 49, 43, 536, DateTimeKind.Local).AddTicks(3265), new DateTime(2026, 1, 13, 8, 49, 43, 536, DateTimeKind.Local).AddTicks(3246) });

            migrationBuilder.CreateIndex(
                name: "IX_ThongSoKyThuat_MaBienThe",
                table: "ThongSoKyThuat",
                column: "MaBienThe",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ThongSoKyThuat_BienThe_MaBienThe",
                table: "ThongSoKyThuat",
                column: "MaBienThe",
                principalTable: "BienThe",
                principalColumn: "MaBTSP",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThongSoKyThuat_BienThe_MaBienThe",
                table: "ThongSoKyThuat");

            migrationBuilder.DropIndex(
                name: "IX_ThongSoKyThuat_MaBienThe",
                table: "ThongSoKyThuat");

            migrationBuilder.DropColumn(
                name: "MaBienThe",
                table: "ThongSoKyThuat");

            migrationBuilder.AddColumn<int>(
                name: "SanPhamMaSanPham",
                table: "ThongSoKyThuat",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaThongSo",
                table: "BienThe",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$5pB38tqdJMdUil0nxEziPuvCG5qaas1tBwtePHzURJawpcj1fth2u", new DateTime(2026, 1, 13, 8, 45, 45, 436, DateTimeKind.Local).AddTicks(635), new DateTime(2026, 1, 13, 8, 45, 45, 436, DateTimeKind.Local).AddTicks(616) });

            migrationBuilder.CreateIndex(
                name: "IX_ThongSoKyThuat_SanPhamMaSanPham",
                table: "ThongSoKyThuat",
                column: "SanPhamMaSanPham");

            migrationBuilder.CreateIndex(
                name: "IX_BienThe_MaThongSo",
                table: "BienThe",
                column: "MaThongSo");

            migrationBuilder.AddForeignKey(
                name: "FK_BienThe_ThongSoKyThuat_MaThongSo",
                table: "BienThe",
                column: "MaThongSo",
                principalTable: "ThongSoKyThuat",
                principalColumn: "MaThongSo",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThongSoKyThuat_SanPham_SanPhamMaSanPham",
                table: "ThongSoKyThuat",
                column: "SanPhamMaSanPham",
                principalTable: "SanPham",
                principalColumn: "MaSanPham");
        }
    }
}
