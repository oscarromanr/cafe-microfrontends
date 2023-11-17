import { ServicioCookie } from "./cookieServicio.js";

export class ServicioUsuario {
    #urlUsuario = 'http://localhost:3000/api/' + 'usuarios/';
    #cookie = new ServicioCookie();

    async inicioSesion(usuarioId) {
        try {
            let response = await fetch(this.#urlUsuario + usuarioId, {
                method: "POST"
            });
            let json = await response.json();
            //console.log(json.token);
            const user = await this.obtenerUsuarioPorId(usuarioId);
            //console.log(user.nombre);
            this.#cookie.setCookie(user.nombre, json.token, 1);
            return json;
        } catch (error) {
            console.log('Error al iniciar sesion', error);
            throw error;
        }
    }

    async obtenerUsuarioPorId(usuarioId){
        try {
            let response = await fetch(this.#urlUsuario + usuarioId);
            let json = await response.json();
            return json.usuario;
        } catch (error) {
            console.log('Error al obtener usuario', error);
            return null;
        }
    }
}