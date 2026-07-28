using Backend.API.DTOs.Auth;

namespace Backend.API.Services;

public interface IAuthService
{
    Task<AuthResponse> RegistrarAsync(RegistrarRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}
