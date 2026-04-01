using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Commands.VoidInvoice;

public record VoidInvoiceCommand(Guid Id) : ICommand;
