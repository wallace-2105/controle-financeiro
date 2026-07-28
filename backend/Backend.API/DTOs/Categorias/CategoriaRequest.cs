using System.ComponentModel.DataAnnotations;

namespace Backend.API.DTOs.Categorias;

public class CategoriaRequest
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tipo é obrigatório")]
    [RegularExpression("^(receita|despesa)$", ErrorMessage = "Tipo deve ser 'receita' ou 'despesa'")]
    public string Tipo { get; set; } = string.Empty;

    [Required(ErrorMessage = "Cor é obrigatória")]
    [RegularExpression("^#[0-9a-fA-F]{6}$", ErrorMessage = "Cor deve ser um hex válido (#RRGGBB)")]
    public string Cor { get; set; } = string.Empty;
}
