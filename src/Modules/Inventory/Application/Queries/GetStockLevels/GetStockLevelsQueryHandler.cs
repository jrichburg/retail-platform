using Dapper;
using Infrastructure.Persistence;
using Modules.Inventory.Application.Dtos;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetStockLevels;

public class GetStockLevelsQueryHandler : IQueryHandler<GetStockLevelsQuery, PagedResult<StockLevelDto>>
{
    private readonly DapperConnectionFactory _connectionFactory;
    private readonly ITenantContext _tenantContext;

    public GetStockLevelsQueryHandler(DapperConnectionFactory connectionFactory, ITenantContext tenantContext)
    {
        _connectionFactory = connectionFactory;
        _tenantContext = tenantContext;
    }

    public async Task<Result<PagedResult<StockLevelDto>>> Handle(GetStockLevelsQuery request, CancellationToken cancellationToken)
    {
        using var connection = _connectionFactory.CreateConnection();

        var whereClause = "WHERE sl.tenant_node_id = @TenantNodeId";
        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            whereClause += " AND (LOWER(p.name) LIKE @Search OR LOWER(p.sku) LIKE @Search)";
        }

        var countSql = $"SELECT COUNT(*) FROM stock_levels sl JOIN products p ON p.id = sl.product_id {whereClause}";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, new
        {
            TenantNodeId = _tenantContext.TenantNodeId,
            Search = $"%{request.Search?.ToLower()}%",
        });

        var dataSql = $"""
            SELECT sl.id AS Id, sl.product_id AS ProductId, p.name AS ProductName, p.sku AS Sku,
                   sl.quantity_on_hand AS QuantityOnHand, sl.quantity_reserved AS QuantityReserved,
                   sl.reorder_point AS ReorderPoint
            FROM stock_levels sl
            JOIN products p ON p.id = sl.product_id
            {whereClause}
            ORDER BY p.name
            OFFSET @Offset LIMIT @Limit
            """;

        var items = (await connection.QueryAsync<StockLevelDto>(dataSql, new
        {
            TenantNodeId = _tenantContext.TenantNodeId,
            Search = $"%{request.Search?.ToLower()}%",
            Offset = (request.Page - 1) * request.PageSize,
            Limit = request.PageSize,
        })).ToList();

        return Result.Success(new PagedResult<StockLevelDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
