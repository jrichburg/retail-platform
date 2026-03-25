using Microsoft.AspNetCore.Mvc;
using SharedKernel;

namespace Api.Extensions;

public static class ResultExtensions
{
    public static IActionResult ToActionResult(this Result result)
    {
        return result.IsSuccess
            ? new OkResult()
            : new BadRequestObjectResult(new { message = result.Error, code = "VALIDATION_ERROR" });
    }

    public static IActionResult ToActionResult<T>(this Result<T> result)
    {
        return result.IsSuccess
            ? new OkObjectResult(result.Value)
            : new BadRequestObjectResult(new { message = result.Error, code = "VALIDATION_ERROR" });
    }

    public static IActionResult ToCreatedResult<T>(this Result<T> result, string routeName, Func<T, object> routeValues)
    {
        if (!result.IsSuccess)
            return new BadRequestObjectResult(new { message = result.Error, code = "VALIDATION_ERROR" });

        return new CreatedAtRouteResult(routeName, routeValues(result.Value!), result.Value);
    }
}
