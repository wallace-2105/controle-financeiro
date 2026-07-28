using Backend.API.Models;

namespace Backend.API.Services;

public interface ITokenService
{
    string GerarToken(Usuario usuario);
}
