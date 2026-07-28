using System.Security.Claims;

namespace Backend.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUsuarioId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? throw new UnauthorizedAccessException("Token inválido");

        return Guid.Parse(sub);
    }
}
