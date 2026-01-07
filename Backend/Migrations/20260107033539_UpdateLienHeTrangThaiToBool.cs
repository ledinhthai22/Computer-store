using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLienHeTrangThaiToBool : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TenDanhMuc",
                table: "DanhMuc",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
            migrationBuilder.AlterColumn<bool>(
                name: "TrangThai",
                table: "LienHe",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$az1GcAQw/5vU.O0BuJHz3.1Fk4HCHBHNFbojF7pe3koA36nIb3wWe", new DateTime(2026, 1, 7, 10, 35, 38, 71, DateTimeKind.Local).AddTicks(504), new DateTime(2026, 1, 7, 10, 35, 38, 71, DateTimeKind.Local).AddTicks(483) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TenDanhMuc",
                table: "DanhMuc",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);
            migrationBuilder.AlterColumn<int>(
                name: "TrangThai",
                table: "LienHe",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$D.XS3zH9nvhK6f3AQpap7e.M.UcdPfTYINjiY6KF250s32IXuDYj6", new DateTime(2026, 1, 6, 23, 42, 4, 210, DateTimeKind.Local).AddTicks(5173), new DateTime(2026, 1, 6, 23, 42, 4, 210, DateTimeKind.Local).AddTicks(5155) });
        }
    }
}
