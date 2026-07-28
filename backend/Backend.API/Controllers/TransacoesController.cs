using Backend.API.DTOs.Transacoes;
using Backend.API.Extensions;
using Backend.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/transacoes")]
[Authorize]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _service;

    public TransacoesController(ITransacaoService service)
    {
        _service = service;
    }

    /// <summary>
    /// Listar transações com filtros opcionais de mês, ano e categoria.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<TransacaoResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar(
        [FromQuery] int? mes,
        [FromQuery] int? ano,
        [FromQuery] Guid? categoriaId)
    {
        var uid = User.GetUsuarioId();
        var result = await _service.ListarAsync(uid, mes, ano, categoriaId);
        return Ok(result);
    }

    /// <summary>
    /// Criar uma nova transação.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(TransacaoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] TransacaoRequest request)
    {
        try
        {
            var uid = User.GetUsuarioId();
            var result = await _service.CriarAsync(uid, request);
            return CreatedAtAction(nameof(Listar), result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Atualizar uma transação existente.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(TransacaoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] TransacaoRequest request)
    {
        try
        {
            var uid = User.GetUsuarioId();
            var result = await _service.AtualizarAsync(uid, id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    /// <summary>
    /// Deletar uma transação.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(Guid id)
    {
        try
        {
            var uid = User.GetUsuarioId();
            await _service.DeletarAsync(uid, id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { mensagem = ex.Message });
        }
    }
}
