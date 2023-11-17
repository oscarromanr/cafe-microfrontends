import { ServicioUsuario } from "./usuarioServicio.js";
import { ServicioCookie } from "./cookieServicio.js";

export class ServicioProducto {
    #urlProducto = 'http://localhost:3000/api/' + 'productos/';
    #user = new ServicioUsuario();
    #cookie = new ServicioCookie();

    async obtenerProductos() {
        try {
            // llamamos el inicio de sesion por ahora mientras aun no tengamos el Login
            //await this.#user.inicioSesion('65249086a443c855443f3b38');
            const usuario = await this.#user.obtenerUsuarioPorId('65249086a443c855443f3b38');
            //console.log(usuario.nombre);
            const token = this.#cookie.getCookie(usuario.nombre);
            //console.log(token);
            let response = await fetch(this.#urlProducto, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            let json = await response.json();
            //console.log(json.productos);
            return json.productos;
        } catch (error) {
            console.log('Error al obtener productos: ', error);
            return null;
        }
    }

    async obtenerProductoPorId(productoId) {
        try {
            let response = await fetch(this.#urlProducto + productoId);
            let json = await response.json();
            return json;
        } catch (error) {
            console.log('Error al obtener producto: ', error);
            return null;
        }
    }

    async crearProducto(productoData) {
        try {
            let response = await fetch(this.#urlProducto, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(productoData)
            });
            let json = response.json();
            return json;
        } catch (error) {
            console.log('Error al crear producto: ', error);
            return null;
        }
    }

    async actualizarProducto(productoId, productoData) {
        try {
            let response = await fetch(this.#urlProducto + productoId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(productoData)
            });
            let json = response.json();
            return json;
        } catch (error) {
            console.log('Error al actualizar producto: ', error);
            return null;
        }
    }

    async eliminarProducto(productoId) {
        try {
            let response = await fetch(this.#urlProducto + productoId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });
            let json = response.json();
            return json;
        } catch (error) {
            console.log('Error al actualizar producto: ', error);
            return null;
        }
    }
}