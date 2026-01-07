using Backend.Data;
using Backend.DTO.Contact;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Contact
{
    public class ContactService : IContactService
    {
        private readonly ApplicationDbContext _DbContext;

        public ContactService(ApplicationDbContext DbContext)
        {
            _DbContext = DbContext;
        }
        public async Task<IEnumerable<ContactResult>> GetAllAsync()
        {
            return await _DbContext.LienHe
                .Where(x => x.Delete_At == null )
                .Select(l => new ContactResult
                {
                    MaLienHe = l.MaLienHe,
                    Email = l.Email,
                    NoiDung = l.NoiDung,
                    TrangThai = l.TrangThai,
                    NgayGui = l.NgayGui,
                    Message = l.TrangThai ? "Đã đọc" : "Chưa đọc"
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<ContactResult>> GetAllUnreadAsync()
        {
            return await _DbContext.LienHe
            .Where(x => x.TrangThai == false && x.Delete_At == null)
                .Select(l => new ContactResult
                {
                    MaLienHe = l.MaLienHe,
                    Email = l.Email,
                    NoiDung = l.NoiDung,
                    TrangThai = l.TrangThai ,
                    Message = "Chưa đọc"
                })
                .ToListAsync();
        }
        public async Task<IEnumerable<ContactResult>> GetAllReadAsync()
        {
            return await _DbContext.LienHe
            .Where(x => x.TrangThai == true && x.Delete_At == null)
                .Select(l => new ContactResult
                {
                    MaLienHe = l.MaLienHe,
                    Email = l.Email,
                    NoiDung = l.NoiDung,
                    TrangThai = l.TrangThai,
                    Message = "Đã đọc"
                })
                .ToListAsync();
        }
        public async Task<ContactResult> SendContactAsync(SendContactRequest req)
        {
            var sendContact = new LienHe
            {

                Email = req.Email,
                NoiDung = req.NoiDung,
                TrangThai = false,
                Delete_At = null,
                NgayGui = DateTime.Now
            };

            _DbContext.Add(sendContact);
            await _DbContext.SaveChangesAsync();

            return new ContactResult
            {
                MaLienHe = sendContact.MaLienHe,
                Email = sendContact.Email,
                NoiDung = sendContact.NoiDung,
                TrangThai = sendContact.TrangThai,
                NgayGui = sendContact.NgayGui,
                Message = "Gửi thành công"
                
            };
        }
        public async Task<bool> DeleteSendcontactAsync(int id)
        {

            var Contact = await _DbContext.LienHe.FindAsync(id);

            if (Contact == null)
            {
                return false;
            }

            Contact.TrangThai = true;
            Contact.Delete_At = DateTime.Now;

            await _DbContext.SaveChangesAsync();

            return true;
        }
        public async Task<ContactResult> ReadContactAsync(int id)
        {
            var contact = await _DbContext.LienHe.FindAsync(id);

            if (contact == null)
            {
                throw new KeyNotFoundException($"Contact with id {id} not found.");
            }

            contact.TrangThai = true;
            await _DbContext.SaveChangesAsync();

            return new ContactResult
            {
                MaLienHe = contact.MaLienHe,
                Email = contact.Email,
                NoiDung = contact.NoiDung,
                TrangThai = true,
                NgayGui = contact.NgayGui,
                Message = "Đã đánh dấu là đã đọc"
            };
        }
    }
}
