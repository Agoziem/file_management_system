import { useState, useEffect } from "react";

type UseLocalStorageReturn<T> = {
  storedValue: T;
  setValue: (value: T | ((val: T) => T)) => void;
  removeValue: () => void;
  loading: boolean;
};

const useLocalStorage = <T>(key: string, initialValue: T): UseLocalStorageReturn<T> => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error("Error parsing localStorage item:", error);
      setStoredValue(initialValue);
    } finally {
      setLoading(false);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error setting localStorage item:", error);
    }
  };

  const removeValue = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error("Error removing localStorage item:", error);
    }
  };

  return {
    storedValue,
    setValue,
    removeValue,
    loading,
  };
};

export default useLocalStorage;
