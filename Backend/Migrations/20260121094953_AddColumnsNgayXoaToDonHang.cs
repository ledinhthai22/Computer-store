using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddColumnsNgayXoaToDonHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "NgayXoa",
                table: "DonHang",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$x8JGMl1zITfzFNcqCaS2beIm1zQGS71xV//hrDO5SR5PiUcE.7q.K", new DateTime(2026, 1, 21, 16, 49, 51, 427, DateTimeKind.Local).AddTicks(4815), new DateTime(2026, 1, 21, 16, 49, 51, 427, DateTimeKind.Local).AddTicks(4802) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NgayXoa",
                table: "DonHang");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$KhCWqczuVZMv26CPlVhxHeGCKSMuVnn6KBes/taexwPWlVbDJXyl2", new DateTime(2026, 1, 21, 9, 46, 20, 368, DateTimeKind.Local).AddTicks(4153), new DateTime(2026, 1, 21, 9, 46, 20, 368, DateTimeKind.Local).AddTicks(4130) });
        }
    }
}
