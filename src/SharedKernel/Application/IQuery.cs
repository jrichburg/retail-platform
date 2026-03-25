using MediatR;

namespace SharedKernel.Application;

public interface IQuery<T> : IRequest<Result<T>> { }
