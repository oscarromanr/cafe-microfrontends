import { ServicioCookie } from "./cookieServicio.js";

export class OrdenServicio {
    #urlOrden = 'http://localhost:3000/api/' + 'ordenes/';
    #cookie = new ServicioCookie();

    async obtenerOrdenes(){
        try {
            let response = await fetch(this.#urlOrden);
            let json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.log('Error al obtener ordenes: ', error);
            return null;
        }
    }

    async eliminarOrden(id){
        try {
            const token = this.#cookie.getCookie('Cafe');
            let response = await fetch(this.#urlOrden + id, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            });
            let json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.log('Error al obtener ordenes: ', error);
            return null;
        }
    }
}