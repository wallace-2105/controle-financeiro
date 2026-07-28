using Backend.API.DTOs.Resumo;

namespace Backend.API.Services;

public interface IResumoService
{
    Task<ResumoResponse> ObterResumoAsync(Guid usuarioId, int mes, int ano);
    Task<EvolucaoResponse> ObterEvolucaoAsync(Guid usuarioId, int meses);
}
