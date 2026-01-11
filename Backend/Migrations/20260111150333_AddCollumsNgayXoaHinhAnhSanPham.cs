using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class AddCollumsNgayXoaHinhAnhSanPham : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$/blTRp9qfpvl4ffeYgul2OFNxU69BrXD/c.O8zXXH1c/t7IDmE23a", new DateTime(2026, 1, 11, 22, 3, 32, 405, DateTimeKind.Local).AddTicks(47), new DateTime(2026, 1, 11, 22, 3, 32, 405, DateTimeKind.Local).AddTicks(30) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$M3EmVXXVonpCq748ZjhDGuSirAzMdsqfu9FsW1h5KrvlBfmR0nYHe", new DateTime(2026, 1, 11, 17, 52, 59, 916, DateTimeKind.Local).AddTicks(8711), new DateTime(2026, 1, 11, 17, 52, 59, 916, DateTimeKind.Local).AddTicks(8686) });
        }
    }
}
