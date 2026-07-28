using Backend.API.DTOs.Categorias;
using Backend.API.Extensions;
using Backend.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.API.Controllers;

[ApiController]
[Route("api/categorias")]
[Authorize]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _service;

    public CategoriasController(ICategoriaService service)
    {
        _service = service;
    }

    /// <summary>
    /// Listar todas as categorias do usuário autenticado.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<CategoriaResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Listar()
    {
        var uid = User.GetUsuarioId();
        var result = await _service.ListarAsync(uid);
        return Ok(result);
    }

    /// <summary>
    /// Criar uma nova categoria.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(CategoriaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Criar([FromBody] CategoriaRequest request)
    {
        var uid = User.GetUsuarioId();
        var result = await _service.CriarAsync(uid, request);
        return CreatedAtAction(nameof(Listar), result);
    }

    /// <summary>
    /// Atualizar uma categoria existente.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(CategoriaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Atualizar(Guid id, [FromBody] CategoriaRequest request)
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
    }

    /// <summary>
    /// Deletar uma categoria (só se não tiver transações vinculadas).
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
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
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }
}
