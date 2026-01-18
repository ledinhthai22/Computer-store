using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class CollumnStatusTableWebInFo : Migration
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
                values: new object[] { "$2a$11$1syk/9Jcn6.WLqhK44rNm.9x9HIOY94wEjPheW1hyUO4XAk4lCmtq", new DateTime(2026, 1, 18, 19, 54, 57, 842, DateTimeKind.Local).AddTicks(7645), new DateTime(2026, 1, 18, 19, 54, 57, 842, DateTimeKind.Local).AddTicks(7621) });
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
                values: new object[] { "$2a$11$PpKRuqavxNRX/F6//2sBe.HJ.pK9F.Lzs4l/DLJnmvDzeUmHg4q1S", new DateTime(2026, 1, 18, 19, 47, 2, 922, DateTimeKind.Local).AddTicks(2376), new DateTime(2026, 1, 18, 19, 47, 2, 922, DateTimeKind.Local).AddTicks(2353) });
        }
    }
}
