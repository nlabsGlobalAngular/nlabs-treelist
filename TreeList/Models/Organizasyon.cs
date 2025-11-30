using System.ComponentModel.DataAnnotations;

namespace TreeList.Models
{
    public class Organizasyon
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string GorselUrl { get; set; } = string.Empty;   
        public bool UstOrganizasyonMu { get; set; }
        public Guid? UstOrganizasyonId { get; set; }
        public Organizasyon? UstOrganizasyon { get; set; }
    }
}