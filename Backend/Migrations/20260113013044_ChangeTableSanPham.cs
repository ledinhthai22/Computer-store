using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTableSanPham : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HinhAnhSanPham_SanPham_MaBienThe",
                table: "HinhAnhSanPham");

            migrationBuilder.DropForeignKey(
                name: "FK_SanPham_ThongSoKyThuat_MaThongSo",
                table: "SanPham");

            migrationBuilder.DropIndex(
                name: "IX_SanPham_MaThongSo",
                table: "SanPham");

            migrationBuilder.DropColumn(
                name: "GiaCoBan",
                table: "SanPham");

            migrationBuilder.DropColumn(
                name: "KhuyenMai",
                table: "SanPham");

            migrationBuilder.DropColumn(
                name: "MaThongSo",
                table: "SanPham");

            migrationBuilder.DropColumn(
                name: "SoLuongTon",
                table: "SanPham");

            migrationBuilder.RenameColumn(
                name: "MaBienThe",
                table: "HinhAnhSanPham",
                newName: "MaSanPham");

            migrationBuilder.RenameIndex(
                name: "IX_HinhAnhSanPham_MaBienThe",
                table: "HinhAnhSanPham",
                newName: "IX_HinhAnhSanPham_MaSanPham");

            migrationBuilder.AddColumn<int>(
                name: "SanPhamMaSanPham",
                table: "ThongSoKyThuat",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TenSanPham",
                table: "SanPham",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "SanPham",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

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
                values: new object[] { "$2a$11$Lj4RxR3KqMABFvhrh3cB1O.ZMNS29PYMWkM9JmRPBFETyrxcTGyIi", new DateTime(2026, 1, 13, 8, 30, 43, 374, DateTimeKind.Local).AddTicks(2562), new DateTime(2026, 1, 13, 8, 30, 43, 374, DateTimeKind.Local).AddTicks(2543) });

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
                name: "FK_HinhAnhSanPham_SanPham_MaSanPham",
                table: "HinhAnhSanPham",
                column: "MaSanPham",
                principalTable: "SanPham",
                principalColumn: "MaSanPham",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThongSoKyThuat_SanPham_SanPhamMaSanPham",
                table: "ThongSoKyThuat",
                column: "SanPhamMaSanPham",
                principalTable: "SanPham",
                principalColumn: "MaSanPham");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BienThe_ThongSoKyThuat_MaThongSo",
                table: "BienThe");

            migrationBuilder.DropForeignKey(
                name: "FK_HinhAnhSanPham_SanPham_MaSanPham",
                table: "HinhAnhSanPham");

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

            migrationBuilder.RenameColumn(
                name: "MaSanPham",
                table: "HinhAnhSanPham",
                newName: "MaBienThe");

            migrationBuilder.RenameIndex(
                name: "IX_HinhAnhSanPham_MaSanPham",
                table: "HinhAnhSanPham",
                newName: "IX_HinhAnhSanPham_MaBienThe");

            migrationBuilder.AlterColumn<string>(
                name: "TenSanPham",
                table: "SanPham",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "SanPham",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<decimal>(
                name: "GiaCoBan",
                table: "SanPham",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<double>(
                name: "KhuyenMai",
                table: "SanPham",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "MaThongSo",
                table: "SanPham",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SoLuongTon",
                table: "SanPham",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$FCZbCdaOKqaK/w0EfR798u.jiXTCbDkOPFaYVuD8paXjOVA0aylUe", new DateTime(2026, 1, 12, 21, 5, 4, 135, DateTimeKind.Local).AddTicks(9324), new DateTime(2026, 1, 12, 21, 5, 4, 135, DateTimeKind.Local).AddTicks(9305) });

            migrationBuilder.CreateIndex(
                name: "IX_SanPham_MaThongSo",
                table: "SanPham",
                column: "MaThongSo",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_HinhAnhSanPham_SanPham_MaBienThe",
                table: "HinhAnhSanPham",
                column: "MaBienThe",
                principalTable: "SanPham",
                principalColumn: "MaSanPham",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SanPham_ThongSoKyThuat_MaThongSo",
                table: "SanPham",
                column: "MaThongSo",
                principalTable: "ThongSoKyThuat",
                principalColumn: "MaThongSo",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
