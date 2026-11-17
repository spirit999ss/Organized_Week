import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type Deserialize<T> = (value: unknown) => T;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  deserialize: Deserialize<T> = (value) => value as T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) return initialValue;
    try {
      return deserialize(JSON.parse(stored) as unknown);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
