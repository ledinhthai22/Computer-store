using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumTomTatWebInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TenTrinhChieu",
                table: "TrinhChieu",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TomTat",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$jApOLlwhOqRFBJhf0582R.8udUKjpA8ZxCmnlL5LkfHOw2RvT4wqS", new DateTime(2026, 1, 20, 21, 54, 43, 564, DateTimeKind.Local).AddTicks(9408), new DateTime(2026, 1, 20, 21, 54, 43, 564, DateTimeKind.Local).AddTicks(9388) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenTrinhChieu",
                table: "TrinhChieu");

            migrationBuilder.DropColumn(
                name: "TomTat",
                table: "ThongTinTrang");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$k/BvXBeOMwqxoJwy4/nWeO9xCEjY.1uhHFzaLZUxxNpkyEHL.YEpm", new DateTime(2026, 1, 20, 14, 18, 31, 961, DateTimeKind.Local).AddTicks(5089), new DateTime(2026, 1, 20, 14, 18, 31, 961, DateTimeKind.Local).AddTicks(5065) });
        }
    }
}
