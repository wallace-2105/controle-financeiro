namespace Backend.API.DTOs.Resumo;

public class ResumoResponse
{
    public decimal TotalReceitas { get; set; }
    public decimal TotalDespesas { get; set; }
    public decimal Saldo { get; set; }
    public List<CategoriaTotalItem> Categorias { get; set; } = new();
}

public class CategoriaTotalItem
{
    public Guid CategoriaId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Cor { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public decimal Total { get; set; }
}
