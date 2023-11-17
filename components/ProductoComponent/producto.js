import { ServicioProducto } from "../../Servicio/productoServicio.js";

export class Producto extends HTMLElement {
    #servicio = new ServicioProducto();
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        this.#render(shadow);
        this.#consultaProductos(shadow);
    }

    async #render(shadow) {
        await fetch('../components/ProductoComponent/producto.html')
            .then(response => response.text())
            .then(html => {
                shadow.innerHTML += html;
            })
            .catch(error => console.error('Error loading HTML: ', error));
    }

    #consultaProductos(shadow) {
        this.#servicio.obtenerProductos()
            .then(productos => {
                let div = shadow.querySelector('#product');
                let tmp = shadow.querySelector('#tmpProduct');
                productos.forEach(element => {
                    this.#despliegaProducto(tmp, div, element)
                });
            });
    }

    #despliegaProducto(tmp, div, producto) {
        let clone = tmp.content.cloneNode(true);
        let img = clone.querySelector('#imagen');
        img.setAttribute('src', producto.imagenurl);
        let h2 = clone.querySelector('#nombre');
        h2.innerHTML = producto.nombre;
        let p = clone.querySelector('#precio');
        p.innerHTML = producto.precio;
        div.appendChild(clone);
    }
}