using Backend.DTO.Contact;

namespace Backend.Services.Contact
{
    public interface IContactService 
    {
        Task<IEnumerable<ContactResult>> GetAllAsync();
        Task<IEnumerable<ContactResult>> GetAllUnreadAsync();
        Task<IEnumerable<ContactResult>> GetAllReadAsync();
        public Task<ContactResult> SendContactAsync(SendContactRequest request);
        public Task<bool> DeleteSendcontactAsync(int id);
        public Task<ContactResult> ReadContactAsync(int id);
    }
}