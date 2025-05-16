import { useState } from 'react';

interface MutationOptions<T, V> {
  onSuccess?: (data: T, variables: V) => void;
  onError?: (error: Error, variables: V) => void;
  onSettled?: (data: T | undefined, error: Error | undefined, variables: V) => void;
}

interface MutationResult<T, V> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  mutate: (variables: V) => Promise<T>;
  reset: () => void;
}

export function useMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<T>,
  options: MutationOptions<T, V> = {}
): MutationResult<T, V> {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (variables: V): Promise<T> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await mutationFn(variables);
      setData(result);
      options.onSuccess?.(result, variables);
      options.onSettled?.(result, undefined, variables);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      options.onError?.(err, variables);
      options.onSettled?.(undefined, err, variables);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData(undefined);
    setError(null);
    setIsLoading(false);
  };

  return { data, isLoading, error, mutate, reset };
}