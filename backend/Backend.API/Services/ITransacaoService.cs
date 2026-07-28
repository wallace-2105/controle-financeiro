using Backend.API.DTOs.Transacoes;

namespace Backend.API.Services;

public interface ITransacaoService
{
    Task<List<TransacaoResponse>> ListarAsync(Guid usuarioId, int? mes, int? ano, Guid? categoriaId);
    Task<TransacaoResponse> CriarAsync(Guid usuarioId, TransacaoRequest request);
    Task<TransacaoResponse> AtualizarAsync(Guid usuarioId, Guid id, TransacaoRequest request);
    Task DeletarAsync(Guid usuarioId, Guid id);
}
