import { ServicioUsuario } from "./usuarioServicio.js";
import { ServicioCookie } from "./cookieServicio.js";

export class ServicioProducto {
    #urlProducto = 'http://localhost:3000/api/' + 'productos/';
    #user = new ServicioUsuario();
    #cookie = new ServicioCookie();

    async obtenerProductos() {
        try {
            let response = await fetch(this.#urlProducto);
            let json = await response.json();
            return json;
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