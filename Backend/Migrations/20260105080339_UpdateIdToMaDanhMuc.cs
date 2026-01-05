using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class UpdateIdToMaDanhMuc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "DanhMuc",
                newName: "MaDanhMuc");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$wL6i3Ru064VEIJRUFOsST.BeLAEXVtMhWC51DG6omDofdeG1nxks2", new DateTime(2026, 1, 5, 15, 3, 39, 376, DateTimeKind.Local).AddTicks(3447), new DateTime(2026, 1, 5, 15, 3, 39, 376, DateTimeKind.Local).AddTicks(3424) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MaDanhMuc",
                table: "DanhMuc",
                newName: "Id");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$cHfFv4qAhWk/SOZFEZuom.mZsKrIr2PpSt2gLmuTIuMQ9DAvGZFTe", new DateTime(2026, 1, 5, 13, 5, 36, 420, DateTimeKind.Local).AddTicks(2538), new DateTime(2026, 1, 5, 13, 5, 36, 420, DateTimeKind.Local).AddTicks(2516) });
        }
    }
}
