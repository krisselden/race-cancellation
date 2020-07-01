<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [race-cancellation](./race-cancellation.md) &gt; [DisposableExecutorFn](./race-cancellation.disposableexecutorfn.md)

## DisposableExecutorFn type

A promise executor that returns a [DisposeFn](./race-cancellation.disposefn.md) function.

<b>Signature:</b>

```typescript
export declare type DisposableExecutorFn<TResult> = (resolve: (value?: TResult | PromiseLike<TResult>) => void, reject: (reason?: unknown) => void) => DisposeFn;
```

## Remarks

For example, if it is the promise of a setTimeout, should call clearTimeout.

If it resolves on an event listener, it should uninstall the event listener.
