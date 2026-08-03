using Backend.API.Data;
using Backend.API.DTOs.Auth;
using Backend.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;

    // Categorias padrão criadas automaticamente ao registrar um novo usuário
    private static readonly (string Nome, TipoCategoria Tipo, string Cor)[] CategoriasIniciais =
    {
        ("Salário",       TipoCategoria.Receita, "#10b981"),
        ("Renda extra",   TipoCategoria.Receita, "#22c55e"),
        ("Investimentos", TipoCategoria.Receita, "#14b8a6"),
        ("Aluguel",       TipoCategoria.Despesa, "#ef4444"),
        ("Mercado",       TipoCategoria.Despesa, "#f97316"),
        ("Lazer",         TipoCategoria.Despesa, "#a855f7"),
        ("Passeios",      TipoCategoria.Despesa, "#ec4899"),
        ("Despesas",      TipoCategoria.Despesa, "#3b82f6"),
    };

    public AuthService(AppDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> RegistrarAsync(RegistrarRequest request)
    {
        var emailNorm = request.Email.Trim().ToLowerInvariant();

        if (await _db.Usuarios.AnyAsync(u => u.Email == emailNorm))
            throw new InvalidOperationException("Este e-mail já está cadastrado.");

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            Nome = request.Nome.Trim(),
            Email = emailNorm,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha),
            CriadoEm = DateTime.UtcNow,
        };

        _db.Usuarios.Add(usuario);

        // Seed de categorias padrão para o novo usuário
        foreach (var (nome, tipo, cor) in CategoriasIniciais)
        {
            _db.Categorias.Add(new Categoria
            {
                Id = Guid.NewGuid(),
                Nome = nome,
                Tipo = tipo,
                Cor = cor,
                UsuarioId = usuario.Id,
            });
        }

        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Token = _tokenService.GerarToken(usuario),
            Nome = usuario.Nome,
            Email = usuario.Email,
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var emailNorm = request.Email.Trim().ToLowerInvariant();

        var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Email == emailNorm)
            ?? throw new InvalidOperationException("E-mail ou senha inválidos.");

        if (!BCrypt.Net.BCrypt.Verify(request.Senha, usuario.SenhaHash))
            throw new InvalidOperationException("E-mail ou senha inválidos.");

        return new AuthResponse
        {
            Token = _tokenService.GerarToken(usuario),
            Nome = usuario.Nome,
            Email = usuario.Email,
        };
    }
}
