import { ServicioCookie } from "./cookieServicio.js";

export class ServicioUsuario {
    #urlUsuario = 'http://localhost:3000/api/' + 'usuarios/';
    #cookie = new ServicioCookie();

    async inicioSesion(usuarioId) {
        try {
            let response = await fetch(this.#urlUsuario + usuarioId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            let json = await response.json();
            console.log(json);
            const user = await this.obtenerUsuarioPorId(usuarioId);
            //console.log(user.nombre);
            this.#cookie.setCookie('Cafe', json.token, 1);
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

    async obtenerUsuarios(){
        try {
            let response = await fetch(this.#urlUsuario);
            let json = await response.json();
            console.log(json);
            return json.usuarios;
        } catch (error) {
            console.log('Error al obtener usuarios', error);
            return null;
        }
    }

    async verificarUsuario(nombre, password){
        try {
            const usuarios = await this.obtenerUsuarios();
            console.log(usuarios)
            for (const user of usuarios) {
                if(user.nombre === nombre){
                    if (user.password === password){
                        return user;
                    } else {
                        return 'La contraseña no coincide';
                    }
                }
            }
            return 'El nombre de usuario no existe';
        } catch (error) {
            console.log('Error al verificar usuario: ', error);
            return null;
        }
    }

    async crearUsuario(nombre, email, password, rol, calle, numerocasa, colonia, telefono){
        try {
            const usuarioData = { nombre, email, password, rol, calle, numerocasa, colonia, telefono }
            console.log(usuarioData)
            let response = await fetch(this.#urlUsuario, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuarioData)
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log('Error al crear usuario: ', error);
            return null;
        }
    }

    async eliminarUsuario(id){
        try {
            const token = this.#cookie.getCookie('Cafe');
            let response = await fetch(this.#urlUsuario + id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log('Error al eliminar usuario: ', error);
            return null;
        }
    }
}