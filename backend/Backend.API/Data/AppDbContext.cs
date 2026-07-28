using Backend.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Usuario ──
        modelBuilder.Entity<Usuario>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).IsRequired().HasMaxLength(200);
            e.Property(u => u.Nome).IsRequired().HasMaxLength(100);
            e.Property(u => u.SenhaHash).IsRequired();
        });

        // ── Categoria ──
        modelBuilder.Entity<Categoria>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Nome).IsRequired().HasMaxLength(100);
            e.Property(c => c.Cor).IsRequired().HasMaxLength(9);
            e.Property(c => c.Tipo)
                .HasConversion<string>()
                .HasMaxLength(10);

            e.HasOne(c => c.Usuario)
                .WithMany(u => u.Categorias)
                .HasForeignKey(c => c.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Transacao ──
        modelBuilder.Entity<Transacao>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Descricao).IsRequired().HasMaxLength(200);
            e.Property(t => t.Valor).HasColumnType("decimal(18,2)");

            e.HasOne(t => t.Categoria)
                .WithMany(c => c.Transacoes)
                .HasForeignKey(t => t.CategoriaId)
                .OnDelete(DeleteBehavior.Restrict);

            e.HasOne(t => t.Usuario)
                .WithMany(u => u.Transacoes)
                .HasForeignKey(t => t.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
