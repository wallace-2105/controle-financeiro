namespace Backend.API.DTOs.Categorias;

public class CategoriaResponse
{
    public Guid Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;   // "receita" | "despesa"
    public string Cor { get; set; } = string.Empty;
}
