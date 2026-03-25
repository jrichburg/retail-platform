using Dapper;
using Infrastructure.Persistence;
using Modules.Catalog.Application.Dtos;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Queries.LookupProduct;

public class LookupProductQueryHandler : IQueryHandler<LookupProductQuery, ProductDto>
{
    private readonly DapperConnectionFactory _connectionFactory;
    private readonly ITenantContext _tenantContext;

    public LookupProductQueryHandler(DapperConnectionFactory connectionFactory, ITenantContext tenantContext)
    {
        _connectionFactory = connectionFactory;
        _tenantContext = tenantContext;
    }

    public async Task<Result<ProductDto>> Handle(LookupProductQuery request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Sku) && string.IsNullOrWhiteSpace(request.Upc))
            return Result.Failure<ProductDto>("Provide either SKU or UPC.");

        using var connection = _connectionFactory.CreateConnection();

        const string sql = """
            SELECT p.id AS Id, p.name AS Name, p.sku AS Sku, p.upc AS Upc,
                   p.category_id AS CategoryId, c.name AS CategoryName, d.name AS DepartmentName,
                   p.retail_price AS RetailPrice, p.cost_price AS CostPrice,
                   p.description AS Description, p.is_active AS IsActive
            FROM products p
            JOIN categories c ON c.id = p.category_id
            JOIN departments d ON d.id = c.department_id
            WHERE p.root_tenant_id = @RootTenantId
              AND p.is_active = true
              AND ((@Sku IS NOT NULL AND p.sku = @Sku) OR (@Upc IS NOT NULL AND p.upc = @Upc))
            LIMIT 1
            """;

        var product = await connection.QueryFirstOrDefaultAsync<ProductDto>(sql, new
        {
            RootTenantId = _tenantContext.RootTenantId,
            Sku = request.Sku,
            Upc = request.Upc,
        });

        if (product == null)
            return Result.Failure<ProductDto>("Product not found.");

        return Result.Success(product);
    }
}
