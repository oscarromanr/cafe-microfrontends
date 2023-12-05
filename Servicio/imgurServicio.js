const clientID = "tokenDeImgur"; // Aquí colocar la clave de cliente de imgur

export class ServicioImgur {

    constructor() { }

    async subirImagen(imagen) {
        const formData = new FormData();
        formData.append('image', imagen);

        const response = await fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: 'Client-ID ' + clientID
            },
            body: formData
        });

        const data = await response.json();

        return data;
    }

}
