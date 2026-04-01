using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Inventory.Application.Dtos;
using Modules.Inventory.Domain.Entities;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetTransfers;

public class GetTransfersQueryHandler : IQueryHandler<GetTransfersQuery, PagedResult<TransferDocumentDto>>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public GetTransfersQueryHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<PagedResult<TransferDocumentDto>>> Handle(GetTransfersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<TransferDocument>()
            .Include(d => d.Lines)
            .AsNoTracking();

        if (!string.IsNullOrEmpty(request.Status))
            query = query.Where(d => d.Status == request.Status);

        var totalCount = await query.CountAsync(cancellationToken);

        var documents = await query
            .OrderByDescending(d => d.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        // Resolve store names
        var storeIds = documents
            .SelectMany(d => new[] { d.SourceTenantNodeId, d.DestinationTenantNodeId })
            .Distinct()
            .ToList();

        var storeNames = await _db.Set<TenantNode>()
            .IgnoreQueryFilters()
            .Where(t => storeIds.Contains(t.Id))
            .AsNoTracking()
            .ToDictionaryAsync(t => t.Id, t => t.Name, cancellationToken);

        var items = documents.Select(d => new TransferDocumentDto
        {
            Id = d.Id,
            DocumentNumber = d.DocumentNumber,
            SourceTenantNodeId = d.SourceTenantNodeId,
            SourceStoreName = storeNames.GetValueOrDefault(d.SourceTenantNodeId, "Unknown"),
            DestinationTenantNodeId = d.DestinationTenantNodeId,
            DestinationStoreName = storeNames.GetValueOrDefault(d.DestinationTenantNodeId, "Unknown"),
            Status = d.Status,
            Notes = d.Notes,
            LineCount = d.Lines.Count,
            TotalUnits = d.Lines.Sum(l => l.Quantity),
            CreatedAt = d.CreatedAt,
        }).ToList();

        return Result.Success(new PagedResult<TransferDocumentDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
