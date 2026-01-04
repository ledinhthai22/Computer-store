using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class lastestUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$ze8YJEy1lpHHsk8OL08znOVFrfrt9PMPurBgCPS9N7vkpt3LeDmya", new DateTime(2026, 1, 4, 18, 56, 49, 58, DateTimeKind.Local).AddTicks(3244), new DateTime(2026, 1, 4, 18, 56, 49, 58, DateTimeKind.Local).AddTicks(3223) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$bxUp/iXuVQi.OTO2ik1iZe4/xgD2qkoJlUOTVEyA5zMsJsOl891F6", new DateTime(2026, 1, 4, 18, 49, 44, 116, DateTimeKind.Local).AddTicks(1570), new DateTime(2026, 1, 4, 18, 49, 44, 116, DateTimeKind.Local).AddTicks(1549) });
        }
    }
}
