using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services.File
{
    public interface IFileService
    {
        Task<string> UploadProductImageAsync(IFormFile file,string tenSanPham,string tenBienThe,bool isAnhChinh,int stt);
        Task DeleteAsync(string fileUrl);
    }
}