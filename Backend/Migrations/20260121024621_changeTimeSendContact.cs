using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class changeTimeSendContact : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$KhCWqczuVZMv26CPlVhxHeGCKSMuVnn6KBes/taexwPWlVbDJXyl2", new DateTime(2026, 1, 21, 9, 46, 20, 368, DateTimeKind.Local).AddTicks(4153), new DateTime(2026, 1, 21, 9, 46, 20, 368, DateTimeKind.Local).AddTicks(4130) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$jApOLlwhOqRFBJhf0582R.8udUKjpA8ZxCmnlL5LkfHOw2RvT4wqS", new DateTime(2026, 1, 20, 21, 54, 43, 564, DateTimeKind.Local).AddTicks(9408), new DateTime(2026, 1, 20, 21, 54, 43, 564, DateTimeKind.Local).AddTicks(9388) });
        }
    }
}
