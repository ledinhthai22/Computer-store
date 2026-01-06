using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class TransferBoolToIntTrangThaiLienHe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                values: new object[] { "$2a$11$br0UzZJlGFweu3zE.YkYk.HhgTIYMveWwnK9pos9FbfYZP02A33py", new DateTime(2026, 1, 6, 9, 34, 43, 563, DateTimeKind.Local).AddTicks(7123), new DateTime(2026, 1, 6, 9, 34, 43, 563, DateTimeKind.Local).AddTicks(7105) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                values: new object[] { "$2a$11$YKwnU9pQB33XHje1xUoYyOM2onxZfDJk5i8QEXhsoJ.ULRr2m/PRi", new DateTime(2026, 1, 6, 8, 31, 13, 72, DateTimeKind.Local).AddTicks(3024), new DateTime(2026, 1, 6, 8, 31, 13, 72, DateTimeKind.Local).AddTicks(3008) });
        }
    }
}
