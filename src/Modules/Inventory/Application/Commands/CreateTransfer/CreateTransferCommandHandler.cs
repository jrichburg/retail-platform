using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Inventory.Domain.Entities;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CreateTransfer;

public class CreateTransferCommandHandler : ICommandHandler<CreateTransferCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateTransferCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateTransferCommand request, CancellationToken cancellationToken)
    {
        if (request.DestinationTenantNodeId == _tenantContext.TenantNodeId)
            return Result.Failure<Guid>("Destination store must be different from the source store.");

        var destination = await _db.Set<TenantNode>()
            .IgnoreQueryFilters()
            .AsNoTracking()
            .FirstOrDefaultAsync(
                t => t.Id == request.DestinationTenantNodeId
                     && t.RootTenantId == _tenantContext.RootTenantId
                     && t.NodeType == "store"
                     && t.IsActive,
                cancellationToken);

        if (destination == null)
            return Result.Failure<Guid>("Destination store not found or does not belong to this tenant.");

        var today = DateTime.UtcNow.Date;
        var todayCount = await _db.Set<TransferDocument>()
            .CountAsync(d => d.TenantNodeId == _tenantContext.TenantNodeId && d.CreatedAt >= today, cancellationToken);
        var docNumber = $"TRF-{DateTime.UtcNow:yyyyMMdd}-{(todayCount + 1):D3}";

        var document = new TransferDocument
        {
            DocumentNumber = docNumber,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
            SourceTenantNodeId = _tenantContext.TenantNodeId,
            DestinationTenantNodeId = request.DestinationTenantNodeId,
            Status = "draft",
            Notes = request.Notes,
            CreatedBy = Guid.Empty,
        };

        foreach (var line in request.Lines)
        {
            document.Lines.Add(new TransferDocumentLine
            {
                ProductId = line.ProductId,
                ProductVariantId = line.ProductVariantId,
                ProductName = line.ProductName,
                Sku = line.Sku,
                Upc = line.Upc,
                VariantDescription = line.VariantDescription,
                Quantity = line.Quantity,
            });
        }

        _db.Set<TransferDocument>().Add(document);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(document.Id);
    }
}
