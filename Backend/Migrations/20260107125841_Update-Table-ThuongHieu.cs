using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTableThuongHieu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrangThai",
                table: "ThuongHieu");

            migrationBuilder.AddColumn<DateTime>(
                name: "IsDeleted",
                table: "ThuongHieu",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$VP8597nM7pmHMZ3NkCiQFO5gtEcMo7b.iztYYCVA77D2BdRx0088e", new DateTime(2026, 1, 7, 19, 58, 38, 797, DateTimeKind.Local).AddTicks(6218), new DateTime(2026, 1, 7, 19, 58, 38, 797, DateTimeKind.Local).AddTicks(6202) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "ThuongHieu");

            migrationBuilder.AddColumn<bool>(
                name: "TrangThai",
                table: "ThuongHieu",
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
