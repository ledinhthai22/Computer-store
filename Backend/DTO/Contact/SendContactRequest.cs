using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTO.Contact
{
    public class SendContactRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
        [MaxLength(2000)]
        public string NoiDung { get; set; } = null!; 
    }
}