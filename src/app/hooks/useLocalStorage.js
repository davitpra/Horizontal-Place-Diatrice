import { useState } from 'react';

// Custom hook para manejar el almacenamiento en sessionStorage
export function useLocalStorage(key, initialValue) {

    // useState con una función inicial para obtener el valor almacenado en sessionStorage
    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Obtener el valor de sessionStorage usando la clave proporcionada
            const item = window.sessionStorage.getItem(key);
            console.log("item: ", item)
            // Parsear el JSON almacenado o devolver el valor inicial si no existe
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // En caso de error, imprimir el error en la consola y devolver el valor inicial
            console.error(error);
            return initialValue;
        }
    });

    // Función para actualizar el valor almacenado
    const setValue = (value) => {
        try {
            // Permitir que el valor sea una función para tener la misma API que useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            // Actualizar el estado con el nuevo valor
            setStoredValue(valueToStore);
            // Guardar el nuevo valor en sessionStorage
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            console.log("valueToStore: ", window.sessionStorage.getItem(key))
        } catch (error) {
            // En caso de error, imprimir el error en la consola
            console.error(error);
        }
    };

    // Devolver el valor almacenado y la función para actualizarlo
    return [storedValue, setValue];
}
