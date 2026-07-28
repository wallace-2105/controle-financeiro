using System.Globalization;
using Backend.API.Data;
using Backend.API.DTOs.Resumo;
using Backend.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Services;

public class ResumoService : IResumoService
{
    private readonly AppDbContext _db;

    public ResumoService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ResumoResponse> ObterResumoAsync(Guid usuarioId, int mes, int ano)
    {
        var transacoes = await _db.Transacoes
            .Include(t => t.Categoria)
            .Where(t => t.UsuarioId == usuarioId
                        && t.Data.Month == mes
                        && t.Data.Year == ano)
            .ToListAsync();

        decimal totalReceitas = 0;
        decimal totalDespesas = 0;

        var categoriaTotais = new Dictionary<Guid, (Categoria Cat, decimal Total)>();

        foreach (var t in transacoes)
        {
            if (t.Categoria.Tipo == TipoCategoria.Receita)
                totalReceitas += t.Valor;
            else
                totalDespesas += t.Valor;

            if (categoriaTotais.TryGetValue(t.CategoriaId, out var existing))
                categoriaTotais[t.CategoriaId] = (existing.Cat, existing.Total + t.Valor);
            else
                categoriaTotais[t.CategoriaId] = (t.Categoria, t.Valor);
        }

        return new ResumoResponse
        {
            TotalReceitas = totalReceitas,
            TotalDespesas = totalDespesas,
            Saldo = totalReceitas - totalDespesas,
            Categorias = categoriaTotais.Values
                .OrderByDescending(x => x.Total)
                .Select(x => new CategoriaTotalItem
                {
                    CategoriaId = x.Cat.Id,
                    Nome = x.Cat.Nome,
                    Cor = x.Cat.Cor,
                    Tipo = x.Cat.Tipo.ToString().ToLowerInvariant(),
                    Total = x.Total,
                })
                .ToList(),
        };
    }

    public async Task<EvolucaoResponse> ObterEvolucaoAsync(Guid usuarioId, int meses)
    {
        var hoje = DateOnly.FromDateTime(DateTime.Today);
        var inicio = hoje.AddMonths(-(meses - 1));
        var primeiroDia = new DateOnly(inicio.Year, inicio.Month, 1);

        var transacoes = await _db.Transacoes
            .Include(t => t.Categoria)
            .Where(t => t.UsuarioId == usuarioId && t.Data >= primeiroDia)
            .ToListAsync();

        var culture = new CultureInfo("pt-BR");
        var result = new List<EvolucaoMesItem>();

        for (int i = 0; i < meses; i++)
        {
            var ref_ = hoje.AddMonths(-(meses - 1 - i));
            int m = ref_.Month;
            int a = ref_.Year;

            decimal receitas = 0, despesas = 0;
            foreach (var t in transacoes.Where(t => t.Data.Month == m && t.Data.Year == a))
            {
                if (t.Categoria.Tipo == TipoCategoria.Receita)
                    receitas += t.Valor;
                else
                    despesas += t.Valor;
            }

            var labelDate = new DateTime(a, m, 1);
            result.Add(new EvolucaoMesItem
            {
                Mes = m,
                Ano = a,
                Label = labelDate.ToString("MMM/yyyy", culture),  // "jul/2026"
                Receitas = receitas,
                Despesas = despesas,
            });
        }

        return new EvolucaoResponse { Meses = result };
    }
}
