using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Uniforms.Application.Dtos;
using Modules.Uniforms.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Uniforms.Application.Queries.GetWorkOrders;

public class GetWorkOrdersQueryHandler : IQueryHandler<GetWorkOrdersQuery, PagedResult<WorkOrderDto>>
{
    private readonly AppDbContext _db;

    public GetWorkOrdersQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PagedResult<WorkOrderDto>>> Handle(GetWorkOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<WorkOrder>()
            .AsNoTracking()
            .Include(w => w.Lines)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Status))
            query = query.Where(w => w.Status == request.Status);
        if (request.CustomerId.HasValue)
            query = query.Where(w => w.CustomerId == request.CustomerId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(w => w.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(w => new WorkOrderDto
            {
                Id = w.Id,
                OrderNumber = w.OrderNumber,
                CustomerId = w.CustomerId,
                CustomerName = w.CustomerName,
                CustomerPhone = w.CustomerPhone,
                Status = w.Status,
                DueDate = w.DueDate,
                Notes = w.Notes,
                TotalAmount = w.TotalAmount,
                LineCount = w.Lines.Count,
                CreatedAt = w.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new PagedResult<WorkOrderDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
