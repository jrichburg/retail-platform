using SharedKernel.Application;
using Modules.AccountsReceivable.Application.Dtos;

namespace Modules.AccountsReceivable.Application.Queries.GetAgingSummary;

public record GetAgingSummaryQuery() : IQuery<AgingSummaryDto>;
