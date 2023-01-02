import { DependencyList, FormEventHandler, useCallback } from 'react';

export const useSubmit = (fn: () => void, deps: DependencyList): FormEventHandler<HTMLFormElement> =>
  useCallback((e) => {
    e.preventDefault();
    fn();
  }, deps);

export const useObjectState = <T, K extends keyof T>(setState: (fn: (value: T) => T) => void, key: K) =>
  useCallback((value: T[K]) => setState((a) => ({ ...a, [key]: value })), [setState]);
