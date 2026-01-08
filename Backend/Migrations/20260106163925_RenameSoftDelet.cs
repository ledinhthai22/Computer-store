using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Migrations
{
    /// <inheritdoc />
    public partial class RenameSoftDelet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Is_Delete",
                table: "SanPham",
                newName: "Delete_At");

            migrationBuilder.AddColumn<DateTime>(
                name: "Delete_At",
                table: "LienHe",
                type: "datetime2",
                nullable: true);

            migrationBuilder.RenameColumn(
                name: "Is_Delete",
                table: "DanhMuc",
                newName: "Delete_At");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Y.aqB4IHwoW5dYld/EtNw.yhxT6i.fkDc74ZKYsS6kEJ4KO0GNgXK", new DateTime(2026, 1, 6, 23, 39, 24, 829, DateTimeKind.Local).AddTicks(9258), new DateTime(2026, 1, 6, 23, 39, 24, 829, DateTimeKind.Local).AddTicks(9240) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Delete_At",
                table: "SanPham",
                newName: "Is_Delete");

            migrationBuilder.RenameColumn(
                name: "Delete_At",
                table: "LienHe",
                newName: "Is_Delete");

            migrationBuilder.RenameColumn(
                name: "Delete_At",
                table: "DanhMuc",
                newName: "Is_Delete");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhauMaHoa", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$mGTQxUhZBERPEJDSKZt/5.RJ5FS15XcvmoA3UJQDN/DibuTU.P9PK", new DateTime(2026, 1, 6, 23, 30, 29, 364, DateTimeKind.Local).AddTicks(5450), new DateTime(2026, 1, 6, 23, 30, 29, 364, DateTimeKind.Local).AddTicks(5430) });
        }
    }
}
