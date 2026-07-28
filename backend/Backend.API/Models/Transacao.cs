using System.ComponentModel.DataAnnotations;

namespace Backend.API.Models;

/// <summary>
/// Transação financeira. O tipo (receita/despesa) é inferido via Categoria.Tipo.
/// </summary>
public class Transacao
{
    public Guid Id { get; set; }

    [Required, MaxLength(200)]
    public string Descricao { get; set; } = string.Empty;

    public decimal Valor { get; set; }

    public DateOnly Data { get; set; }

    public Guid CategoriaId { get; set; }
    public Categoria Categoria { get; set; } = null!;

    public Guid UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;
}
