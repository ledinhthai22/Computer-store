using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumnsSoLuongTon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DungLuongRam",
                table: "ThongSoKyThuat",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SoLuongTon",
                table: "SanPham",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$PR1S64mLGrPOHUInLMQnmuAosGluYm7dFMq7yj2d9qWL8XniXWm0G", new DateTime(2026, 1, 14, 19, 9, 36, 188, DateTimeKind.Local).AddTicks(7622), new DateTime(2026, 1, 14, 19, 9, 36, 188, DateTimeKind.Local).AddTicks(7605) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DungLuongRam",
                table: "ThongSoKyThuat");

            migrationBuilder.DropColumn(
                name: "SoLuongTon",
                table: "SanPham");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$qR4iGPBtRjy2.6CGoxsaQOk8JhS9UMkz3dUUGuzdWsBVHVAw8CiJG", new DateTime(2026, 1, 13, 10, 14, 9, 872, DateTimeKind.Local).AddTicks(2851), new DateTime(2026, 1, 13, 10, 14, 9, 872, DateTimeKind.Local).AddTicks(2833) });
        }
    }
}
