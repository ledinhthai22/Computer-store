using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class Change_Name_InToNguoiDung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Delete_At",
                table: "NguoiDung",
                newName: "NgayXoa");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$RgClTPIFJJk0gfmVAsu4h.COVKKi5aabpOOByUffS9SshKgE8CRDi", new DateTime(2026, 1, 13, 8, 59, 49, 775, DateTimeKind.Local).AddTicks(595), new DateTime(2026, 1, 13, 8, 59, 49, 775, DateTimeKind.Local).AddTicks(576) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NgayXoa",
                table: "NguoiDung",
                newName: "Delete_At");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$KHI1PAX22E/30.F47ibOXurymEnzg6qEGjUOQHSLCToCzAh9AsnRy", new DateTime(2026, 1, 13, 8, 49, 43, 536, DateTimeKind.Local).AddTicks(3265), new DateTime(2026, 1, 13, 8, 49, 43, 536, DateTimeKind.Local).AddTicks(3246) });
        }
    }
}
