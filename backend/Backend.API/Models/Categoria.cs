using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.API.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TipoCategoria
{
    Receita,
    Despesa
}

public class Categoria
{
    public Guid Id { get; set; }

    [Required, MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    public TipoCategoria Tipo { get; set; }

    [Required, MaxLength(9)]
    public string Cor { get; set; } = "#000000";

    public Guid UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;

    public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
}
