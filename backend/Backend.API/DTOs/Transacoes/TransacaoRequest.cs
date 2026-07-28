using System.ComponentModel.DataAnnotations;

namespace Backend.API.DTOs.Transacoes;

public class TransacaoRequest
{
    [Required(ErrorMessage = "Descrição é obrigatória")]
    [MaxLength(200)]
    public string Descricao { get; set; } = string.Empty;

    [Required(ErrorMessage = "Valor é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser maior que zero")]
    public decimal Valor { get; set; }

    [Required(ErrorMessage = "Data é obrigatória")]
    public string Data { get; set; } = string.Empty;   // "YYYY-MM-DD"

    [Required(ErrorMessage = "CategoriaId é obrigatório")]
    public Guid CategoriaId { get; set; }
}
