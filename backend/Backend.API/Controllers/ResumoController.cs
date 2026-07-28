using Backend.API.DTOs.Resumo;
using Backend.API.Extensions;
using Backend.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/resumo")]
[Authorize]
public class ResumoController : ControllerBase
{
    private readonly IResumoService _service;

    public ResumoController(IResumoService service)
    {
        _service = service;
    }

    /// <summary>
    /// Obter resumo financeiro do mês (total receitas, despesas, saldo, gastos por categoria).
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ResumoResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterResumo([FromQuery] int mes, [FromQuery] int ano)
    {
        if (mes < 1 || mes > 12)
            return BadRequest(new { mensagem = "Mês deve estar entre 1 e 12." });
        if (ano < 2000 || ano > 2100)
            return BadRequest(new { mensagem = "Ano inválido." });

        var uid = User.GetUsuarioId();
        var result = await _service.ObterResumoAsync(uid, mes, ano);
        return Ok(result);
    }

    /// <summary>
    /// Obter evolução de receitas e despesas dos últimos N meses.
    /// </summary>
    [HttpGet("evolucao")]
    [ProducesResponseType(typeof(EvolucaoResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObterEvolucao([FromQuery] int meses = 6)
    {
        if (meses < 1 || meses > 24)
            return BadRequest(new { mensagem = "Quantidade de meses deve estar entre 1 e 24." });

        var uid = User.GetUsuarioId();
        var result = await _service.ObterEvolucaoAsync(uid, meses);
        return Ok(result);
    }
}
