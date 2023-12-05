import { ServicioCookie } from "./cookieServicio.js";

export class ServicioOrden {
    #urlOrden = 'http://localhost:3000/api/' + 'ordenes/';
    #cookie = new ServicioCookie();

    async eliminarOrden(id, token){
        try {
            let response = await fetch(this.#urlOrden + id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log('Error al obtener ordenes: ', error);
            return null;
        }
    }

    async crearOrden(idUsuario, fechaOrden, estado, total, productos, direccionEnvio, metodoPago, token){
        try {
            let response = await fetch(this.#urlOrden, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({idUsuario, fechaOrden, estado, total, productos, direccionEnvio, metodoPago})
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log('Error al crear orden: ', error);
            return null;
        }
    }

    async obtenerOrdenesPorUsuario(idUsuario, token){
        try {
            let response = await fetch(this.#urlOrden + `usuario/${idUsuario}`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log('Error al obtener orden: ', error);
            return null;   
        }
    }

    async obtenerOrdenesPorId(idOrden, token){
        try {
            let response = await fetch(this.#urlOrden + idOrden, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            let json = await response.json();
            return json;
        } catch (error) {
            console.log('Error al obtener orden: ', error);
            return null;   
        }
    }
}