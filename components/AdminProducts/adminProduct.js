import { ServicioProducto } from "../../Servicio/productoServicio.js";

export class AdminProducts extends HTMLElement {
    #servicio = new ServicioProducto();
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', () => {
            this.#render(shadow);
            this.#consultaProductos(shadow);
        });
    }

    #render(shadow) {
        shadow.innerHTML = `
        <link rel="stylesheet" href="../../components/AdminProducts/css/adminProducts.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
        
        <div class="container bg-light py-5">
            <div class="col-md-12 m-auto text-center">
                <h1 class="h1 text-titulos text-center">Lista de productos</h1>
            </div>
        </div>
        
        <div class="container mx-auto justify-center">
        
            <table class="min-w-full bg-white border border-gray-300" id="tabla">
                <thead>
                    <tr>
                        <th class="py-2 px-4 border-b">Nombre</th>
                        <th class="py-2 px-4 border-b">Imagen</th>
                        <th class="py-2 px-4 border-b">Descripción</th>
                        <th class="py-2 px-4 border-b">Categoría</th>
                        <th class="py-2 px-4 border-b">Precio</th>
                        <th class="py-2 px-4 border-b">Stock</th>
                        <th class="py-2 px-4 border-b">Actualizar</th>
                        <th class="py-2 px-4 border-b">Eliminar</th>
                    </tr>
                </thead>
            </table>
        
            <div class="mt-6 items-center">
                <a class="bg-green-500 text-brown-500 py-2 px-4 rounded" href=""><i class="fa fa-shopping-cart">Registrar Nuevo
                        Producto</i></a>
            </div>
        </div>
        `
    }

    #consultaProductos(shadow) {
        this.#servicio.obtenerProductos()
            .then(products => {
                let table = shadow.querySelector('#tabla');
                let tbody = document.createElement('tbody');
                const productos = products.productos;
                productos.forEach(element => {
                    this.#despliegaProducto(table, tbody, element);
                });
            })
    }

    #despliegaProducto(table, tbody, producto) {
        tbody.innerHTML +=
            `
                <tr>
                <td class="py-2 px-4 border-b">${producto.nombre}</td>
                <td class="py-2 px-4 border-b">
                    <img src="${producto.imagenurl}" alt="Imagen del Producto"
                        class="h-10 w-10 object-cover rounded-full">
                </td>
                <td class="py-2 px-4 border-b">${producto.descripcion}</td>
                <td class="py-2 px-4 border-b">${producto.categoria}</td>
                <td class="py-2 px-4 border-b">${producto.precio}</td>
                <td class="py-2 px-4 border-b">${producto.stock}</td>
                <td class="py-2 px-4 border-b">
                    <button class="bg-brown-500 text-brown-500 py-1 px-2 rounded" id="btnActualizar">Actualizar</button>
                </td>
                <td class="py-2 px-4 border-b">
                    <button class="bg-red-500 text-brown-500 py-1 px-2 rounded" id="btnEliminar">Eliminar</button>
                </td>
                </tr>
                <hr class="mb-20">
            `
        table.appendChild(tbody);
    }
}