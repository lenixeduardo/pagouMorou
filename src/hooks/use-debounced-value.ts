import { useEffect, useState } from "react";

/** Segura um valor por `delay` ms. Usado na busca para não disparar uma
 * consulta ao Postgres a cada tecla digitada. */
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
