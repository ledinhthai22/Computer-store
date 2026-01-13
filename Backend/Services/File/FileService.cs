using Backend.Services.File;
using Microsoft.AspNetCore.Hosting;
using System.Text;
using System.Text.RegularExpressions;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _env;

    public FileService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> UploadProductImageAsync(IFormFile file, string tenSanPham,string tenBienThe,bool isAnhChinh,int stt
    )
    {
        if (file == null || file.Length == 0)
            throw new Exception("File ảnh không hợp lệ");

        // 📁 wwwroot/product/image
        var folderPath = Path.Combine(_env.WebRootPath, "product", "image");

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        // 🧼 chuẩn hoá tên
        tenSanPham = NormalizeName(tenSanPham);
        tenBienThe = NormalizeName(tenBienThe);

        var date = DateTime.Now.ToString("dd-MM-yy");
        var anhChinh = isAnhChinh ? "AnhChinh" : "AnhPhu";
        var ext = Path.GetExtension(file.FileName);

        var fileName =
            $"{date}-{tenSanPham}-{tenBienThe}_Anh-{anhChinh}-{stt}{ext}";

        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // 🌐 URL public
        return $"/product/image/{fileName}";
    }

    public Task DeleteAsync(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl)) return Task.CompletedTask;

        var fullPath = Path.Combine(
            _env.WebRootPath,
            fileUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString())
        );

        if (File.Exists(fullPath))
            File.Delete(fullPath);

        return Task.CompletedTask;
    }

    // ======================
    // Utils
    // ======================
    private string NormalizeName(string input)
    {
        input = input.ToLowerInvariant();
        input = RemoveVietnameseTone(input);
        input = Regex.Replace(input, @"[^a-z0-9\- ]", "");
        input = input.Replace(" ", "-");
        return input;
    }

    private string RemoveVietnameseTone(string text)
    {
        var normalized = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();

        foreach (var c in normalized)
        {
            if (System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c)
                != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }
        return sb.ToString();
    }
}
