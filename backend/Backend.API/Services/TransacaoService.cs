using Backend.API.Data;
using Backend.API.DTOs.Transacoes;
using Backend.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Services;

public class TransacaoService : ITransacaoService
{
    private readonly AppDbContext _db;

    public TransacaoService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<TransacaoResponse>> ListarAsync(
        Guid usuarioId, int? mes, int? ano, Guid? categoriaId)
    {
        var query = _db.Transacoes
            .Include(t => t.Categoria)
            .Where(t => t.UsuarioId == usuarioId);

        if (mes.HasValue && ano.HasValue)
        {
            query = query.Where(t => t.Data.Month == mes.Value && t.Data.Year == ano.Value);
        }
        else if (ano.HasValue)
        {
            query = query.Where(t => t.Data.Year == ano.Value);
        }

        if (categoriaId.HasValue)
        {
            query = query.Where(t => t.CategoriaId == categoriaId.Value);
        }

        return await query
            .OrderByDescending(t => t.Data)
            .ThenByDescending(t => t.Id)
            .Select(t => ToResponse(t))
            .ToListAsync();
    }

    public async Task<TransacaoResponse> CriarAsync(Guid usuarioId, TransacaoRequest request)
    {
        var categoria = await _db.Categorias
            .FirstOrDefaultAsync(c => c.Id == request.CategoriaId && c.UsuarioId == usuarioId)
            ?? throw new KeyNotFoundException("Categoria não encontrada.");

        if (!DateOnly.TryParseExact(request.Data, "yyyy-MM-dd", out var data))
            throw new ArgumentException("Data inválida. Use o formato yyyy-MM-dd.");

        var transacao = new Transacao
        {
            Id = Guid.NewGuid(),
            Descricao = request.Descricao.Trim(),
            Valor = request.Valor,
            Data = data,
            CategoriaId = request.CategoriaId,
            UsuarioId = usuarioId,
            Categoria = categoria,
        };

        _db.Transacoes.Add(transacao);
        await _db.SaveChangesAsync();

        return ToResponse(transacao);
    }

    public async Task<TransacaoResponse> AtualizarAsync(Guid usuarioId, Guid id, TransacaoRequest request)
    {
        var transacao = await _db.Transacoes
            .Include(t => t.Categoria)
            .FirstOrDefaultAsync(t => t.Id == id && t.UsuarioId == usuarioId)
            ?? throw new KeyNotFoundException("Transação não encontrada.");

        // Validar que a nova categoria pertence ao usuário
        var categoria = await _db.Categorias
            .FirstOrDefaultAsync(c => c.Id == request.CategoriaId && c.UsuarioId == usuarioId)
            ?? throw new KeyNotFoundException("Categoria não encontrada.");

        if (!DateOnly.TryParseExact(request.Data, "yyyy-MM-dd", out var data))
            throw new ArgumentException("Data inválida. Use o formato yyyy-MM-dd.");

        transacao.Descricao = request.Descricao.Trim();
        transacao.Valor = request.Valor;
        transacao.Data = data;
        transacao.CategoriaId = request.CategoriaId;
        transacao.Categoria = categoria;

        await _db.SaveChangesAsync();

        return ToResponse(transacao);
    }

    public async Task DeletarAsync(Guid usuarioId, Guid id)
    {
        var transacao = await _db.Transacoes
            .FirstOrDefaultAsync(t => t.Id == id && t.UsuarioId == usuarioId)
            ?? throw new KeyNotFoundException("Transação não encontrada.");

        _db.Transacoes.Remove(transacao);
        await _db.SaveChangesAsync();
    }

    private static TransacaoResponse ToResponse(Transacao t) => new()
    {
        Id = t.Id,
        Descricao = t.Descricao,
        Valor = t.Valor,
        Data = t.Data.ToString("yyyy-MM-dd"),
        CategoriaId = t.CategoriaId,
        CategoriaNome = t.Categoria.Nome,
        CategoriaCor = t.Categoria.Cor,
        Tipo = t.Categoria.Tipo.ToString().ToLowerInvariant(),
    };
}
