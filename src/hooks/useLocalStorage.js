import { useEffect, useState } from "react";

function readStoredValue(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch (error) {
    console.error(`No se pudo leer el dato local "${key}".`, error);
    return fallback;
  }
}

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() =>
    typeof window === "undefined"
      ? initialValue
      : readStoredValue(key, initialValue),
  );
  const [loadedKey, setLoadedKey] = useState(key);

  useEffect(() => {
    if (loadedKey !== key) {
      setValue(readStoredValue(key, initialValue));
      setLoadedKey(key);
    }
  }, [initialValue, key, loadedKey]);

  useEffect(() => {
    if (loadedKey !== key) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`No se pudo guardar el dato local "${key}".`, error);
    }
  }, [key, loadedKey, value]);

  return [value, setValue];
}
