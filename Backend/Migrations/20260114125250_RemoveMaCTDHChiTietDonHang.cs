using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMaCTDHChiTietDonHang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaCTDH",
                table: "ChiTietDonHang");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$8gOKlTn7XttJTqB6zIYsReIurOsoodixZLikakuwH6N2VF4wPU6bu", new DateTime(2026, 1, 14, 19, 52, 47, 855, DateTimeKind.Local).AddTicks(4382), new DateTime(2026, 1, 14, 19, 52, 47, 855, DateTimeKind.Local).AddTicks(4367) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaCTDH",
                table: "ChiTietDonHang",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$5u1jQnvt0t7f7ssw7zCB/.XeHY8bTkVvVB2v38SkQjIIP4MZ6twD2", new DateTime(2026, 1, 13, 17, 20, 9, 959, DateTimeKind.Local).AddTicks(4426), new DateTime(2026, 1, 13, 17, 20, 9, 959, DateTimeKind.Local).AddTicks(4408) });
        }
    }
}
