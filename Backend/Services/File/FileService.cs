using Backend.Services.File;
using Microsoft.AspNetCore.Hosting;
using System.Text;
using System.Text.RegularExpressions;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _env;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private readonly long _maxFileSize = 5 * 1024 * 1024; // 5MB

    public FileService(IWebHostEnvironment env)
    {
        _env = env;
    }

    /// <summary>
    /// Validate file hình ảnh - Kiểm tra extension, size, MIME type và magic bytes
    /// </summary>
    private void ValidateImageFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File không hợp lệ");

        // 1. Kiểm tra extension
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
        {
            throw new ArgumentException(
                $"Định dạng file không được hỗ trợ. Chỉ chấp nhận: {string.Join(", ", _allowedExtensions)}"
            );
        }

        // 2. Kiểm tra kích thước file
        if (file.Length > _maxFileSize)
        {
            var maxSizeMB = _maxFileSize / (1024 * 1024);
            throw new ArgumentException($"Kích thước file vượt quá {maxSizeMB}MB");
        }

        // 3. Kiểm tra MIME type
        var allowedMimeTypes = new[] {
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
        };
        if (!allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
        {
            throw new ArgumentException("Loại MIME của file không hợp lệ");
        }

        // 4. Kiểm tra magic bytes (signature thực sự của file)
        using var stream = file.OpenReadStream();
        var buffer = new byte[8];
        stream.Read(buffer, 0, 8);
        stream.Position = 0; // Reset position để có thể đọc lại sau

        if (!IsValidImageSignature(buffer, extension))
        {
            throw new ArgumentException("File không phải là ảnh hợp lệ (signature không khớp với extension)");
        }
    }


    private bool IsValidImageSignature(byte[] buffer, string extension)
    {
        return extension switch
        {
            ".jpg" or ".jpeg" => buffer[0] == 0xFF && buffer[1] == 0xD8 && buffer[2] == 0xFF,
            ".png" => buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47,
            ".gif" => buffer[0] == 0x47 && buffer[1] == 0x49 && buffer[2] == 0x46,
            ".webp" => buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46,
            _ => false
        };
    }
    public async Task<string> UploadProductImageAsync(
        IFormFile file,
        string tenSanPham,
        string tenBienThe,
        bool isAnhChinh,
        int stt
    )
    {
        // Validate file trước khi upload
        ValidateImageFile(file);

        // Tạo thư mục nếu chưa tồn tại
        var folderPath = Path.Combine(_env.WebRootPath, "product", "image");
        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        // Chuẩn hóa tên file
        var normalizedProductName = NormalizeName(tenSanPham);
        var normalizedVariantName = NormalizeName(tenBienThe);
        var date = DateTime.Now.ToString("dd-MM-yy");
        var anhChinh = isAnhChinh ? "AnhChinh" : "AnhPhu";
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

        // Tạo tên file theo format: {date}-{tenSanPham}-{tenBienThe}_Anh-{AnhChinh/AnhPhu}-{stt}{ext}
        var fileName = $"{date}-{normalizedProductName}-{normalizedVariantName}_Anh-{anhChinh}-{stt}{ext}";
        var filePath = Path.Combine(folderPath, fileName);

        // Kiểm tra trùng tên file, nếu trùng thêm timestamp
        if (File.Exists(filePath))
        {
            var timestamp = DateTime.Now.ToString("HHmmss");
            fileName = $"{date}-{normalizedProductName}-{normalizedVariantName}_Anh-{anhChinh}-{stt}-{timestamp}{ext}";
            filePath = Path.Combine(folderPath, fileName);
        }

        // Lưu file
        try
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Lỗi khi lưu file: {ex.Message}", ex);
        }

        // Trả về chỉ TÊN FILE (không bao gồm đường dẫn)
        return fileName;
    }

    public Task DeleteAsync(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl))
            return Task.CompletedTask;

        try
        {
            // Nếu fileUrl chỉ là tên file, ghép với đường dẫn mặc định
            string fullPath;
            if (!fileUrl.Contains(Path.DirectorySeparatorChar) && !fileUrl.Contains('/'))
            {
                // Chỉ là tên file
                fullPath = Path.Combine(_env.WebRootPath, "product", "image", fileUrl);
            }
            else
            {
                // Là đường dẫn đầy đủ
                fullPath = Path.Combine(
                    _env.WebRootPath,
                    fileUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString())
                );
            }

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        }
        catch (Exception ex)
        {
            // Log error nhưng không throw để không ảnh hưởng flow chính
            Console.WriteLine($"Lỗi khi xóa file {fileUrl}: {ex.Message}");
        }

        return Task.CompletedTask;
    }


    private string NormalizeName(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return "default";

        // Chuyển về lowercase
        input = input.ToLowerInvariant();

        // Bỏ dấu tiếng Việt
        input = RemoveVietnameseTone(input);

        // Chỉ giữ lại a-z, 0-9, dấu gạch ngang và khoảng trắng
        input = Regex.Replace(input, @"[^a-z0-9\- ]", "");

        // Thay khoảng trắng bằng dấu gạch ngang
        input = input.Replace(" ", "-");

        // Loại bỏ các dấu gạch ngang liên tiếp
        input = Regex.Replace(input, @"-+", "-");

        // Trim dấu gạch ngang ở đầu và cuối
        input = input.Trim('-');

        // Giới hạn độ dài tên file (tránh tên quá dài)
        if (input.Length > 50)
            input = input.Substring(0, 50).TrimEnd('-');

        return string.IsNullOrWhiteSpace(input) ? "default" : input;
    }


    private string RemoveVietnameseTone(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        var normalized = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();

        foreach (var c in normalized)
        {
            var category = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (category != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }

        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}