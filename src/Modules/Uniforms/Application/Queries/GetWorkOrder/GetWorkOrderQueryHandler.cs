using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Uniforms.Application.Dtos;
using Modules.Uniforms.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Uniforms.Application.Queries.GetWorkOrder;

public class GetWorkOrderQueryHandler : IQueryHandler<GetWorkOrderQuery, WorkOrderDetailDto>
{
    private readonly AppDbContext _db;

    public GetWorkOrderQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<WorkOrderDetailDto>> Handle(GetWorkOrderQuery request, CancellationToken cancellationToken)
    {
        var wo = await _db.Set<WorkOrder>()
            .AsNoTracking()
            .Include(w => w.Lines)
            .Where(w => w.Id == request.Id)
            .Select(w => new WorkOrderDetailDto
            {
                Id = w.Id,
                OrderNumber = w.OrderNumber,
                CustomerId = w.CustomerId,
                CustomerName = w.CustomerName,
                CustomerPhone = w.CustomerPhone,
                CustomerEmail = w.CustomerEmail,
                Status = w.Status,
                DueDate = w.DueDate,
                Notes = w.Notes,
                TotalAmount = w.TotalAmount,
                CreatedAt = w.CreatedAt,
                Lines = w.Lines.Select(l => new WorkOrderLineDto
                {
                    Id = l.Id,
                    Description = l.Description,
                    ProductVariantId = l.ProductVariantId,
                    ProductName = l.ProductName,
                    Sku = l.Sku,
                    Quantity = l.Quantity,
                    UnitPrice = l.UnitPrice,
                    LineTotal = l.Quantity * l.UnitPrice,
                }).ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (wo == null) return Result.Failure<WorkOrderDetailDto>("Work order not found.");
        return Result.Success(wo);
    }
}
