using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models;

public class Usuario
{
    public Guid Id { get; set; }

    [Required, MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string SenhaHash { get; set; } = string.Empty;

    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;

    public ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();
    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
