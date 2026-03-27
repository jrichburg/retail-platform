using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateSizeGrid;

public record CreateSizeGridCommand(
    string Name,
    string Dimension1Label,
    string? Dimension2Label,
    List<SizeGridValueInput> Values
) : ICommand<Guid>;

public record SizeGridValueInput(int Dimension, string Value, int SortOrder);
