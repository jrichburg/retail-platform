using MediatR;

namespace SharedKernel.Application;

public interface ICommand : IRequest<Result> { }
public interface ICommand<T> : IRequest<Result<T>> { }
