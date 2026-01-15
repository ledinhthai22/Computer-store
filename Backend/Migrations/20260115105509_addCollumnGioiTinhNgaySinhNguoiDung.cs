using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class addCollumnGioiTinhNgaySinhNguoiDung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "GioiTinh",
                table: "NguoiDung",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgaySinh",
                table: "NguoiDung",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "GioiTinh", "MatKhauMaHoa", "NgayCapNhat", "NgaySinh", "NgayTao" },
                values: new object[] { false, "$2a$11$Kt1oAtoIbbFXSdWS7lsbQ.EYeSVd1/jkUiUMUJhEs/DW..WRGJbbW", new DateTime(2026, 1, 15, 17, 55, 7, 988, DateTimeKind.Local).AddTicks(5489), null, new DateTime(2026, 1, 15, 17, 55, 7, 988, DateTimeKind.Local).AddTicks(5468) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GioiTinh",
                table: "NguoiDung");

            migrationBuilder.DropColumn(
                name: "NgaySinh",
                table: "NguoiDung");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$PR1S64mLGrPOHUInLMQnmuAosGluYm7dFMq7yj2d9qWL8XniXWm0G", new DateTime(2026, 1, 14, 19, 9, 36, 188, DateTimeKind.Local).AddTicks(7622), new DateTime(2026, 1, 14, 19, 9, 36, 188, DateTimeKind.Local).AddTicks(7605) });
        }
    }
}
