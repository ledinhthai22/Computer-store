using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class UpdateYeuThich : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "Deleted_At",
                table: "YeuThich",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$PrRp08.PKgq45bi6ItiJKeCB0a/M45aK6gJA8XK7y3WzhlaTEwOL.", new DateTime(2026, 1, 6, 8, 30, 9, 829, DateTimeKind.Local).AddTicks(9546), new DateTime(2026, 1, 6, 8, 30, 9, 829, DateTimeKind.Local).AddTicks(9528) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "Deleted_At",
                table: "YeuThich",
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
                values: new object[] { "$2a$11$R2lrMeGHBIRESeJYLQ3bcuZBvn.LPIa9jrW66rpJldJagCv6nGqmO", new DateTime(2026, 1, 6, 0, 16, 23, 691, DateTimeKind.Local).AddTicks(9599), new DateTime(2026, 1, 6, 0, 16, 23, 691, DateTimeKind.Local).AddTicks(9584) });
        }
    }
}
