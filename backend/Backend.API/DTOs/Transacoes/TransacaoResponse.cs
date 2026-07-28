namespace Backend.API.DTOs.Transacoes;

/// <summary>
/// DTO denormalizado: inclui tipo/nome/cor da categoria para facilitar o frontend.
/// </summary>
public class TransacaoResponse
{
    public Guid Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Data { get; set; } = string.Empty;        // "YYYY-MM-DD"
    public Guid CategoriaId { get; set; }
    public string CategoriaNome { get; set; } = string.Empty;
    public string CategoriaCor { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;        // "receita" | "despesa"
}
