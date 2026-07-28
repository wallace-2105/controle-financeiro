namespace Backend.API.DTOs.Resumo;

public class EvolucaoResponse
{
    public List<EvolucaoMesItem> Meses { get; set; } = new();
}

public class EvolucaoMesItem
{
    public int Mes { get; set; }
    public int Ano { get; set; }
    public string Label { get; set; } = string.Empty;   // ex: "jul/2026"
    public decimal Receitas { get; set; }
    public decimal Despesas { get; set; }
}
