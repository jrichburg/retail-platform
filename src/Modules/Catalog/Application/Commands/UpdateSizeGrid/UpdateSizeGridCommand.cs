using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.UpdateSizeGrid;

public record UpdateSizeGridCommand(
    Guid Id,
    string Name,
    string Dimension1Label,
    string? Dimension2Label,
    bool IsActive,
    List<CreateSizeGrid.SizeGridValueInput> Values
) : ICommand;
