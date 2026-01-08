using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumnsNguoiDung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "TrangThai",
                table: "NguoiDung",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "Delete_At",
                table: "NguoiDung",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "Delete_At", "MatKhauMaHoa", "NgayCapNhat", "NgayTao", "TrangThai" },
                values: new object[] { null, "$2a$11$XsnWJdMkBCh/6j7I9BPoWeZwbAmA3H6lxRvjfzxMAgUyD.VpYKF2i", new DateTime(2026, 1, 7, 14, 26, 38, 802, DateTimeKind.Local).AddTicks(2962), new DateTime(2026, 1, 7, 14, 26, 38, 802, DateTimeKind.Local).AddTicks(2943), true });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Delete_At",
                table: "NguoiDung");

            migrationBuilder.AlterColumn<int>(
                name: "TrangThai",
                table: "NguoiDung",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao", "TrangThai" },
                values: new object[] { "$2a$11$az1GcAQw/5vU.O0BuJHz3.1Fk4HCHBHNFbojF7pe3koA36nIb3wWe", new DateTime(2026, 1, 7, 10, 35, 38, 71, DateTimeKind.Local).AddTicks(504), new DateTime(2026, 1, 7, 10, 35, 38, 71, DateTimeKind.Local).AddTicks(483), 1 });
        }
    }
}
