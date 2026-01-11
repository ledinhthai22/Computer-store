using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class FixmodelNameTheSameClassDiagram : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TongTienGiam",
                table: "DonHang");

            migrationBuilder.DropColumn(
                name: "TongTienGoc",
                table: "DonHang");

            migrationBuilder.RenameColumn(
                name: "Deleted_At",
                table: "YeuThich",
                newName: "NgayXoa");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "ThuongHieu",
                newName: "NgayXoa");

            migrationBuilder.RenameColumn(
                name: "IsDelete",
                table: "ThongTinTrang",
                newName: "NgayXoa");

            migrationBuilder.RenameColumn(
                name: "Delete_At",
                table: "SanPham",
                newName: "NgayXoa");

            migrationBuilder.RenameColumn(
                name: "Delete_At",
                table: "LienHe",
                newName: "NgayXoa");

            migrationBuilder.RenameColumn(
                name: "URL",
                table: "HinhAnhSanPham",
                newName: "DuongDanAnh");

            migrationBuilder.RenameColumn(
                name: "Delete_At",
                table: "DanhMuc",
                newName: "NgayXoa");

            migrationBuilder.RenameColumn(
                name: "Deleted_At",
                table: "BienThe",
                newName: "NgayXoa");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayXoa",
                table: "DiaChiNhanHang",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayXoa",
                table: "DanhGia",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "TrangThai",
                table: "DanhGia",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$M3EmVXXVonpCq748ZjhDGuSirAzMdsqfu9FsW1h5KrvlBfmR0nYHe", new DateTime(2026, 1, 11, 17, 52, 59, 916, DateTimeKind.Local).AddTicks(8711), new DateTime(2026, 1, 11, 17, 52, 59, 916, DateTimeKind.Local).AddTicks(8686) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NgayXoa",
                table: "DiaChiNhanHang");

            migrationBuilder.DropColumn(
                name: "NgayXoa",
                table: "DanhGia");

            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "DanhGia");

            migrationBuilder.RenameColumn(
                name: "NgayXoa",
                table: "YeuThich",
                newName: "Deleted_At");

            migrationBuilder.RenameColumn(
                name: "NgayXoa",
                table: "ThuongHieu",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "NgayXoa",
                table: "ThongTinTrang",
                newName: "IsDelete");

            migrationBuilder.RenameColumn(
                name: "NgayXoa",
                table: "SanPham",
                newName: "Delete_At");

            migrationBuilder.RenameColumn(
                name: "NgayXoa",
                table: "LienHe",
                newName: "Delete_At");

            migrationBuilder.RenameColumn(
                name: "DuongDanAnh",
                table: "HinhAnhSanPham",
                newName: "URL");

            migrationBuilder.RenameColumn(
                name: "NgayXoa",
                table: "DanhMuc",
                newName: "Delete_At");

            migrationBuilder.RenameColumn(
                name: "NgayXoa",
                table: "BienThe",
                newName: "Deleted_At");

            migrationBuilder.AddColumn<decimal>(
                name: "TongTienGiam",
                table: "DonHang",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

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
                values: new object[] { "$2a$11$ZDuRXjS/mMAnoPywq57aAO/kK19mJLAmbs6rMnFAR8m97P0DfVsA6", new DateTime(2026, 1, 7, 20, 26, 46, 192, DateTimeKind.Local).AddTicks(1037), new DateTime(2026, 1, 7, 20, 26, 46, 192, DateTimeKind.Local).AddTicks(1016) });
        }
    }
}
