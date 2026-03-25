using System.Text;
using Api.Middleware;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SharedKernel.Application.Behaviors;

var builder = WebApplication.CreateBuilder(args);

// Infrastructure (EF Core, Dapper, Redis, TenantContext, CurrentUser)
builder.Services.AddInfrastructure(builder.Configuration);

// MediatR — scan all module assemblies + SharedKernel
var moduleAssemblies = AppDomain.CurrentDomain.GetAssemblies()
    .Where(a => a.GetName().Name?.StartsWith("Modules.") == true)
    .ToList();

// Ensure module assemblies are loaded (they may not be loaded yet at startup)
var modulePaths = Directory.GetFiles(AppContext.BaseDirectory, "Modules.*.dll");
foreach (var path in modulePaths)
{
    var assemblyName = System.Reflection.AssemblyName.GetAssemblyName(path);
    if (!moduleAssemblies.Any(a => a.GetName().Name == assemblyName.Name))
    {
        moduleAssemblies.Add(System.Reflection.Assembly.Load(assemblyName));
    }
}

var allAssemblies = moduleAssemblies
    .Append(typeof(SharedKernel.Application.ICommand).Assembly)
    .ToArray();

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblies(allAssemblies);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

// FluentValidation — auto-register validators from all assemblies
builder.Services.AddValidatorsFromAssemblies(allAssemblies);

// Authentication — Supabase JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var supabaseUrl = builder.Configuration["Supabase:Url"] ?? "";
        var jwtSecret = builder.Configuration["Supabase:JwtSecret"] ?? "";

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"{supabaseUrl}/auth/v1",
            ValidateAudience = true,
            ValidAudience = "authenticated",
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",  // Back Office
                "http://localhost:3002")  // e-Commerce
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Auto-migrate and seed in Development
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<Infrastructure.Persistence.AppDbContext>();
    await db.Database.MigrateAsync();
    await Api.Seeds.TenantSeeder.SeedAsync(db);
    await Api.Seeds.AuthSeeder.SeedAsync(db);
    await Api.Seeds.CatalogSeeder.SeedAsync(db);

    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware pipeline order matters
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<TenantResolutionMiddleware>();

app.MapControllers();

app.Run();
