import { ServicioProducto } from "../../Servicio/productoServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

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
        
        <section class="bg-brown-50">
            <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="w-full mb-6">
                        <h1 class="text-brown-100 text-4xl md:text-5xl mt-8 p-8 text-center font-medium font-helvetica">Lista de productos</h1>
                    </div>
            </div>       

            <div class="z-10 p-8 w-full bg-brown-400">
                <div class="overflow-x-auto">
                    <table class="p-8 bg-brown-50 mb-4 w-full max-w-6xl md:p-6 mx-auto table-auto rounded text-lg" id="tabla">
                        <thead>
                            <tr>
                                <th class="py-1 px-2 text-left border-b bg-brown-100 text-brown-50">ID</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Nombre</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Imágen</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Descripción</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Categoría</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Precio</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Stock</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Actualizar</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Eliminar</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="mt-6 items-center mb-4 w-full max-w-6xl mx-auto">
                    <a class="bg-brown-100 font-medium text-lg font-helvetica p-4 transition-all rounded scroll-smooth md:mr-4 text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg" href="../../src/admin-register-product.html"><i class="fa fa-shopping-cart"></i> Registrar nuevo producto</a>
                </div>
            </div>
        </section>

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
            }).then(() => {
                this.#eliminarProducto();
            })
    }

    #eliminarProducto() {
        const btnEliminar = this.shadowRoot.querySelectorAll('.bg-red-600');
        btnEliminar.forEach((boton) => {
            boton.addEventListener('click', () => {
                const fila = boton.closest('tr');
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¿Deseas eliminar este producto?",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#815F51',
                    cancelButtonColor: '#E53E3E',
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar',
                    background: '#F9F5F3',
                    iconColor: '#815F51',
                    color: '#36241C'
                }).then((result) => {
                    if(result.isConfirmed){
                        const id = fila.querySelector('#idProduct').textContent
                        this.#servicio.eliminarProducto(id)
                        Swal.fire({
                            title: 'Producto eliminado',
                            text: "El producto se elimino exitosamente",
                            icon: 'success',
                            confirmButtonColor: '#815F51',
                            background: '#F9F5F3', 
                            iconColor: '#815F51',
                            color: '#36241C',
                            showCancelButton: true,
                            cancelButtonText: 'Cerrar',
                            cancelButtonColor: '#E53E3E',
                            confirmButtonText: 'Volver al menu',
                            confirmButtonAriaLabel: 'Volver al catalogo'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = 'admin-index.html';
                            }
                        })
                    }
                })
            })
        })
    }

    #despliegaProducto(table, tbody, producto) {
        tbody.innerHTML +=
            `   
            <tr class="bg-brown-25 text-brown-300 font-roboto">
            <td id="idProduct" class="py-1 px-2 border-b">${producto._id}</td>
            <td id="name" class="py-2 px-4 border-b">${producto.nombre}</td>
            <td class="py-2 px-4 border-b">
                <img src="../../img/${producto.imagenurl}" alt="${producto.nombre}"
                   class="w-21 object-cover rounded-lg">
            </td>
            <td class="py-2 px-4 border-b">${producto.descripcion}</td>
            <td class="py-2 px-4 border-b">${producto.categoria}</td>
            <td class="py-2 px-4 border-b">$${producto.precio}</td>
            <td class="py-2 px-4 border-b">${producto.stock}</td>
            <td class="py-2 px-4 border-b">
                <a id="btn-actualizar" href="admin-update-product.html?id=${producto._id}" class="bg-brown-100 font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg">Actualizar</a>
            </td>
            <td class="py-2 px-4 border-b">
               <button id="btn-eliminar" class="bg-red-600 font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-25 hover:bg-red-900 hover:text-white hover:drop-shadow-lg">Eliminar</button>
            </td>

            </tr>
            `
        table.appendChild(tbody);
    }
}