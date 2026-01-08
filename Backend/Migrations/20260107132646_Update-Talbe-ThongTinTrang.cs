using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTalbeThongTinTrang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "ThongTinTrang");

            migrationBuilder.AddColumn<DateTime>(
                name: "IsDelete",
                table: "ThongTinTrang",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$ZDuRXjS/mMAnoPywq57aAO/kK19mJLAmbs6rMnFAR8m97P0DfVsA6", new DateTime(2026, 1, 7, 20, 26, 46, 192, DateTimeKind.Local).AddTicks(1037), new DateTime(2026, 1, 7, 20, 26, 46, 192, DateTimeKind.Local).AddTicks(1016) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDelete",
                table: "ThongTinTrang");

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
                values: new object[] { "$2a$11$PrRp08.PKgq45bi6ItiJKeCB0a/M45aK6gJA8XK7y3WzhlaTEwOL.", new DateTime(2026, 1, 6, 8, 30, 9, 829, DateTimeKind.Local).AddTicks(9546), new DateTime(2026, 1, 6, 8, 30, 9, 829, DateTimeKind.Local).AddTicks(9528) });
        }
    }
}
