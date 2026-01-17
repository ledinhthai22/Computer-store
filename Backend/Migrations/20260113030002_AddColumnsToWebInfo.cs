using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnsToWebInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "TrangThai",
                table: "ThongTinTrang",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$d869L3PzSwRrH8MsHTUCwOEM89Q7Bt.yl4dBGiH.LpZ1VYnNU7zEi", new DateTime(2026, 1, 13, 9, 59, 59, 7, DateTimeKind.Local).AddTicks(5896), new DateTime(2026, 1, 13, 9, 59, 59, 7, DateTimeKind.Local).AddTicks(5880) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "ThongTinTrang");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$FCZbCdaOKqaK/w0EfR798u.jiXTCbDkOPFaYVuD8paXjOVA0aylUe", new DateTime(2026, 1, 12, 21, 5, 4, 135, DateTimeKind.Local).AddTicks(9324), new DateTime(2026, 1, 12, 21, 5, 4, 135, DateTimeKind.Local).AddTicks(9305) });
        }
    }
}
