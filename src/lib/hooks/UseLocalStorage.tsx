import { useState, useEffect } from 'react';

const localStoragEventBus = new EventTarget();

/**
 * Custom hook for reading/writing to localStorage
 *
 * @returns {Array} An array containing:
 * @returns value: string for key set in localStorage
 * @returns setValue: (newValue: string) => setter
 */
export const useLocalStorage = (key: string, initialValue?: any) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage ${key}`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));

      const event = new CustomEvent(`localStorage-${key}`, {
        detail: { newValue: value },
      });
      localStoragEventBus.dispatchEvent(event);
    } catch (error) {
      console.warn(`Error setting localStorage ${key}`, error);
    }
  }, [key, value]);

  useEffect(() => {
    const handleSameWindowChange = (event: any) => {
      setValue(event.detail.newValue);
    };

    const handleOtherWindowChange = (event: any) => {
      if (event.key === key) {
        try {
          setValue(event.newValue ? JSON.parse(event.newValue) : initialValue);
        } catch (error) {
          console.warn('Error parsing localStorage: ', error);
          setValue(initialValue);
        }
      }
    };

    window.addEventListener('storage', handleOtherWindowChange);
    localStoragEventBus.addEventListener(`localStorage-${key}`, handleSameWindowChange);
    return () => {
      window.removeEventListener('storage', handleOtherWindowChange);
      localStoragEventBus.removeEventListener(`localStorage-${key}`, handleSameWindowChange);
    };
  }, [key, initialValue]);

  return [value, setValue];
};
