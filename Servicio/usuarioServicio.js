import { ServicioCookie } from "./cookieServicio.js";
// require('dotenv').config({path: '../variables.env'});


export class ServicioUsuario {
    #urlUsuario = 'http://localhost:3000/api/' + 'usuarios/';
    #cookie = new ServicioCookie();

    async inicioSesion(email, password) {
        try {
            const user = await this.obtenerUsuarioPorCorreo(email);
            if (user) {
                if (user.password === password) {
                    let response = await fetch(this.#urlUsuario + user._id, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    let json = await response.json();
                    const usuarioCookie = {
                        token: json.token
                    };
                    this.#cookie.setCookie('usuario', JSON.stringify(usuarioCookie), 1);
                    return usuarioCookie;
                } else {
                    return 'Contraseña incorrecta';
                }
            }
            return 'El correo electrónico no está registrado';
        } catch (error) {
            console.log('Error al iniciar sesion: ', error);
            throw error;
        }
    }

    async obtenerUsuarioPorId(usuarioId) {
        try {
            let response = await fetch(this.#urlUsuario + usuarioId);
            let json = await response.json();

            return json.usuario;
        } catch (error) {
            console.log('Error al obtener usuario: ', error);
            return null;
        }
    }

    async obtenerUsuarios() {
        try {
            let response = await fetch(this.#urlUsuario);
            let json = await response.json();
            return json.usuarios;
        } catch (error) {
            console.log('Error al obtener usuarios: ', error);
            return null;
        }
    }

    async obtenerUsuarioPorCorreo(email) {
        try {
            let response = await fetch(this.#urlUsuario + `email/${email}`);
            let json = await response.json();

            return json.usuario;
        } catch (error) {
            console.log('Error al obtener usuario por correo: ', error);
            return null;
        }
    }

    async crearUsuario(nombre, email, calle, numerocasa, colonia, telefono, password) {
        try {
            const user = await this.obtenerUsuarioPorCorreo(email);

            if (!user) {
                const usuarioData = { nombre, email, calle, numerocasa, colonia, telefono, password }
                let response = await fetch(this.#urlUsuario, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(usuarioData)
                });
                let json = await response.json();
                return json;
            } else {
                return 'El correo electrónico ya está registrado';
            }
        } catch (error) {
            console.log('Error al crear usuario: ', error);
            return null;
        }
    }

    async eliminarUsuario(usuarioId, token) {
        try {
            let response = await fetch(this.#urlUsuario + usuarioId, {
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
    async cambiarPassword(usuarioId, token, password) {
        try {
            let response = await fetch(this.#urlUsuario + usuarioId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ password })
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log('Error al cambiar contraseña: ', error);
            return null;
        }
    }

    async actualizarUsuario(usuarioId, token, nombre, email, calle, numerocasa, colonia, telefono) {
        try {
            let response = await fetch(this.#urlUsuario + usuarioId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ nombre, email, calle, numerocasa, colonia, telefono })
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log('Error al actualizar usuario: ', error);
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