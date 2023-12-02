export class Crypto {
    constructor() {
    }

    static encryptData(data) {
        try {
            let encryptedData = data;
            return encryptedData;
        } catch (error) {
            console.log('Error al cifrar los datos: ', error);
            return null;
        }
    }

    static decryptData(data) {
        try {
            let decryptedData = data;
            return decryptedData;
        } catch (error) {
            console.log('Error al descifrar los datos: ', error);
            return null;
        }
    }
}