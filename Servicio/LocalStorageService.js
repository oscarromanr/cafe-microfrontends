import { Crypto } from './Crypto.js';

export class LocalStorageService {
    constructor() {
    }

    static setItem(key, value) {
        try {
            const encryptedValue = Crypto.encryptData(value);
            localStorage.setItem(key, encryptedValue);
        } catch (error) {
            console.log('Error al guardar el item: ', error);
        }
    }

    static getItem(key) {
        try {
            const encryptedValue = localStorage.getItem(key);
            const decryptedValue = Crypto.decryptData(encryptedValue);
            return decryptedValue;
        } catch (error) {
            console.log('Error al obtener el item: ', error);
            return null;
        }
    }

    static removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.log('Error al eliminar el item: ', error);
        }
    }

    static clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.log('Error al limpiar el local storage: ', error);
        }
    }
}