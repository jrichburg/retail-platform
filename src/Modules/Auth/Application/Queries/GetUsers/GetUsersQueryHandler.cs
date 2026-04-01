using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Auth.Application.Dtos;
using Modules.Auth.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Auth.Application.Queries.GetUsers;

public class GetUsersQueryHandler : IQueryHandler<GetUsersQuery, PagedResult<AppUserListDto>>
{
    private readonly AppDbContext _db;

    public GetUsersQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PagedResult<AppUserListDto>>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<AppUser>()
            .AsNoTracking()
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(u =>
                u.FirstName.ToLower().Contains(search) ||
                u.LastName.ToLower().Contains(search) ||
                u.Email.ToLower().Contains(search));
        }

        if (request.IsActive.HasValue)
            query = query.Where(u => u.IsActive == request.IsActive.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(u => u.LastName).ThenBy(u => u.FirstName)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(u => new AppUserListDto
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                IsActive = u.IsActive,
                Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList(),
                CreatedAt = u.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new PagedResult<AppUserListDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
