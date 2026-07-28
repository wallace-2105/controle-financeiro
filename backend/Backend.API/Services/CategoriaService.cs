using Backend.API.Data;
using Backend.API.DTOs.Categorias;
using Backend.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Services;

public class CategoriaService : ICategoriaService
{
    private readonly AppDbContext _db;

    public CategoriaService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CategoriaResponse>> ListarAsync(Guid usuarioId)
    {
        return await _db.Categorias
            .Where(c => c.UsuarioId == usuarioId)
            .OrderBy(c => c.Tipo)
            .ThenBy(c => c.Nome)
            .Select(c => ToResponse(c))
            .ToListAsync();
    }

    public async Task<CategoriaResponse> CriarAsync(Guid usuarioId, CategoriaRequest request)
    {
        var categoria = new Categoria
        {
            Id = Guid.NewGuid(),
            Nome = request.Nome.Trim(),
            Tipo = ParseTipo(request.Tipo),
            Cor = request.Cor,
            UsuarioId = usuarioId,
        };

        _db.Categorias.Add(categoria);
        await _db.SaveChangesAsync();

        return ToResponse(categoria);
    }

    public async Task<CategoriaResponse> AtualizarAsync(Guid usuarioId, Guid id, CategoriaRequest request)
    {
        var categoria = await _db.Categorias
            .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId)
            ?? throw new KeyNotFoundException("Categoria não encontrada.");

        categoria.Nome = request.Nome.Trim();
        categoria.Tipo = ParseTipo(request.Tipo);
        categoria.Cor = request.Cor;

        await _db.SaveChangesAsync();

        return ToResponse(categoria);
    }

    public async Task DeletarAsync(Guid usuarioId, Guid id)
    {
        var categoria = await _db.Categorias
            .FirstOrDefaultAsync(c => c.Id == id && c.UsuarioId == usuarioId)
            ?? throw new KeyNotFoundException("Categoria não encontrada.");

        // Verificar se existem transações vinculadas
        var temTransacoes = await _db.Transacoes.AnyAsync(t => t.CategoriaId == id);
        if (temTransacoes)
            throw new InvalidOperationException("Não é possível excluir uma categoria que possui transações vinculadas.");

        _db.Categorias.Remove(categoria);
        await _db.SaveChangesAsync();
    }

    private static TipoCategoria ParseTipo(string tipo) =>
        tipo.ToLowerInvariant() switch
        {
            "receita" => TipoCategoria.Receita,
            "despesa" => TipoCategoria.Despesa,
            _ => throw new ArgumentException($"Tipo inválido: {tipo}")
        };

    private static CategoriaResponse ToResponse(Categoria c) => new()
    {
        Id = c.Id,
        Nome = c.Nome,
        Tipo = c.Tipo.ToString().ToLowerInvariant(),
        Cor = c.Cor,
    };
}
