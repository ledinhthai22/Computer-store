using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class ChangeNgayXoaNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayXoa",
                table: "BienThe",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$qR4iGPBtRjy2.6CGoxsaQOk8JhS9UMkz3dUUGuzdWsBVHVAw8CiJG", new DateTime(2026, 1, 13, 10, 14, 9, 872, DateTimeKind.Local).AddTicks(2851), new DateTime(2026, 1, 13, 10, 14, 9, 872, DateTimeKind.Local).AddTicks(2833) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayXoa",
                table: "BienThe",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$RgClTPIFJJk0gfmVAsu4h.COVKKi5aabpOOByUffS9SshKgE8CRDi", new DateTime(2026, 1, 13, 8, 59, 49, 775, DateTimeKind.Local).AddTicks(595), new DateTime(2026, 1, 13, 8, 59, 49, 775, DateTimeKind.Local).AddTicks(576) });
        }
    }
}
