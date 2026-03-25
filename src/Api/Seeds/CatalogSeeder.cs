using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Catalog.Domain.Entities;
using Modules.Tenants.Domain.Entities;

namespace Api.Seeds;

public static class CatalogSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Set<Department>().AnyAsync())
            return;

        var root = await db.Set<TenantNode>().FirstOrDefaultAsync(n => n.NodeType == "root");
        if (root == null) return;

        // Departments
        var mensFootwear = new Department { Name = "Men's Footwear", SortOrder = 1, TenantNodeId = root.Id, RootTenantId = root.Id };
        var womensFootwear = new Department { Name = "Women's Footwear", SortOrder = 2, TenantNodeId = root.Id, RootTenantId = root.Id };
        var apparel = new Department { Name = "Apparel", SortOrder = 3, TenantNodeId = root.Id, RootTenantId = root.Id };

        db.Set<Department>().AddRange(mensFootwear, womensFootwear, apparel);
        await db.SaveChangesAsync();

        // Categories
        var running = new Category { DepartmentId = mensFootwear.Id, Name = "Running", SortOrder = 1, TenantNodeId = root.Id, RootTenantId = root.Id };
        var casual = new Category { DepartmentId = mensFootwear.Id, Name = "Casual", SortOrder = 2, TenantNodeId = root.Id, RootTenantId = root.Id };
        var wRunning = new Category { DepartmentId = womensFootwear.Id, Name = "Running", SortOrder = 1, TenantNodeId = root.Id, RootTenantId = root.Id };
        var tops = new Category { DepartmentId = apparel.Id, Name = "Tops", SortOrder = 1, TenantNodeId = root.Id, RootTenantId = root.Id };
        var bottoms = new Category { DepartmentId = apparel.Id, Name = "Bottoms", SortOrder = 2, TenantNodeId = root.Id, RootTenantId = root.Id };

        db.Set<Category>().AddRange(running, casual, wRunning, tops, bottoms);
        await db.SaveChangesAsync();

        // Products
        var products = new[]
        {
            new Product { Name = "Brooks Ghost 16", Sku = "BRK-GH16-BLK-10", Upc = "190340123456", CategoryId = running.Id, RetailPrice = 139.99m, CostPrice = 70.00m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "Brooks Ghost 16", Sku = "BRK-GH16-BLU-10", Upc = "190340123457", CategoryId = running.Id, RetailPrice = 139.99m, CostPrice = 70.00m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "New Balance 990v6", Sku = "NB-990V6-GRY-10", Upc = "194768234567", CategoryId = running.Id, RetailPrice = 199.99m, CostPrice = 100.00m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "ASICS Gel-Kayano 30", Sku = "ASC-KAY30-BLK-9", Upc = "168987654321", CategoryId = running.Id, RetailPrice = 159.99m, CostPrice = 80.00m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "Hey Dude Wally", Sku = "HD-WALLY-TAN-10", Upc = "845678901234", CategoryId = casual.Id, RetailPrice = 59.99m, CostPrice = 30.00m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "Birkenstock Arizona", Sku = "BRK-ARIZ-BRN-42", Upc = "886543210987", CategoryId = casual.Id, RetailPrice = 109.99m, CostPrice = 55.00m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "Brooks Glycerin 21 W", Sku = "BRK-GLY21W-PNK-8", Upc = "190340234567", CategoryId = wRunning.Id, RetailPrice = 159.99m, CostPrice = 80.00m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "ASICS Nimbus 26 W", Sku = "ASC-NIM26W-BLU-7", Upc = "168987654322", CategoryId = wRunning.Id, RetailPrice = 159.99m, CostPrice = 80.00m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "Nike Dri-FIT Tee", Sku = "NK-DRFT-BLK-M", Upc = "195230123456", CategoryId = tops.Id, RetailPrice = 34.99m, CostPrice = 17.50m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "Balega Hidden Comfort", Sku = "BAL-HC-WHT-M", Upc = "823456789012", CategoryId = tops.Id, RetailPrice = 16.99m, CostPrice = 8.50m, Description = "Running socks", TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "Nike Tempo Short", Sku = "NK-TMPO-BLK-M", Upc = "195230234567", CategoryId = bottoms.Id, RetailPrice = 39.99m, CostPrice = 20.00m, TenantNodeId = root.Id, RootTenantId = root.Id },
            new Product { Name = "Brooks Run Tight", Sku = "BRK-RTGHT-BLK-S", Upc = "190340345678", CategoryId = bottoms.Id, RetailPrice = 74.99m, CostPrice = 37.50m, TenantNodeId = root.Id, RootTenantId = root.Id },
        };

        db.Set<Product>().AddRange(products);
        await db.SaveChangesAsync();
    }
}
