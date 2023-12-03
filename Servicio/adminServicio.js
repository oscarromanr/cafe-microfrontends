import { ServicioCookie } from "./cookieServicio.js";

export class ServicioAdministrador {

    #urlAdmin = 'http://localhost:3000/api/' + 'administradores/';
    #cookie = new ServicioCookie();

    async inicioSesion(email, password) {
        try {
            const admin = await this.obtenerAdminPorCorreo(email);
            if (admin) {
                if (admin.password === password) {
                    let response = await fetch(this.#urlAdmin + admin._id, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    let json = await response.json();

                    const adminCookie = {
                        token: json.token
                    };
                    this.#cookie.setCookie('admin', JSON.stringify(adminCookie), 1);
                    return adminCookie;
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

    async obtenerAdminPorId(adminId) {
        try {
            let response = await fetch(this.#urlAdmin + adminId);
            let json = await response.json();

            return json.administrador;
        } catch (error) {
            console.log('Error al obtener admin: ', error);
            return null;
        }
    }

    async obtenerAdminPorCorreo(email) {
        try {
            let response = await fetch(this.#urlAdmin + `email/${email}`);
            let json = await response.json();

            return json.administrador;
        } catch (error) {
            console.log('Error al obtener admin: ', error);
            return null;
        }
    }
}