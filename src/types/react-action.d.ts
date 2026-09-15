import 'react';

declare module 'react' {
  export function useActionState<State, InitialState>(
    action: (state: Awaited<State>) => State | Promise<State>,
    initialState: InitialState,
    permalink?: string,
  ): [state: Awaited<State>, formAction: () => void, isPending: boolean];

  export function useActionState<State, InitialState, Payload>(
    action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
    initialState: InitialState,
    permalink?: string,
  ): [state: Awaited<State>, formAction: (payload: Payload) => void, isPending: boolean];
}
