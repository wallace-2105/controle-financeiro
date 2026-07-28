using Backend.API.DTOs.Categorias;

namespace Backend.API.Services;

public interface ICategoriaService
{
    Task<List<CategoriaResponse>> ListarAsync(Guid usuarioId);
    Task<CategoriaResponse> CriarAsync(Guid usuarioId, CategoriaRequest request);
    Task<CategoriaResponse> AtualizarAsync(Guid usuarioId, Guid id, CategoriaRequest request);
    Task DeletarAsync(Guid usuarioId, Guid id);
}
