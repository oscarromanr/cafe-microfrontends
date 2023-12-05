import { OrdenServicio } from "../../Servicio/ordenServicio";

export class OrderList extends HTMLElement {
    #servicio = new OrdenServicio();
    constructor(){
        super();
    }

    connectedCallback(){
        const shadow = this.attachShadow({mode: "open"});
        document.addEventListener('DOMContentLoaded', ()=> {
            this.#render(shadow);
            this.#consultaProductos(shadow);
        })
    }

    #render(shadow){
        shadow.innerHTML = `
            <link rel="stylesheet" href="../../components/OrdersComponent/css/orders.css">
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
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Usuario</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Fecha Orden</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Estado</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Total</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50"># Productos</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Direccion envio</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Metodo pago</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Ver orden</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Eliminar orden</th>
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
        this.#servicio.obtenerOrdenes()
            .then(orders => {
                let table = shadow.querySelector('#tabla');
                let tbody = document.createElement('tbody');
                const ordenes = orders.ordens;
                ordenes.forEach(element => {
                    this.#despliegaProducto(table, tbody, element);
                });
            })
    }

    #despliegaProducto(table, tbody, orden){
        tbody.innerHTML +=
            `   
            <tr class="bg-brown-25 text-brown-300 font-roboto">
            <td id="idProduct" class="py-1 px-2 border-b">${orden._id}</td>
            <td id="name" class="py-2 px-4 border-b">${orden.idUsuario}</td>
            <td class="py-2 px-4 border-b">${orden.fechaOrden}</td>
            <td class="py-2 px-4 border-b">${orden.estado}</td>
            <td class="py-2 px-4 border-b">${orden.total}</td>
            <td class="py-2 px-4 border-b">$${orden.productos.length}</td>
            <td class="py-2 px-4 border-b">${orden.direccionEnvio}</td>
            <td class="py-2 px-4 border-b">${orden.metodoPago}</td>
            <td class="py-2 px-4 border-b">
                <a id="btn-ver" href="" class="bg-brown-100 font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg">Ver</a>
            </td>
            <td class="py-2 px-4 border-b">
               <button id="btn-eliminar" class="bg-red-600 font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-25 hover:bg-red-900 hover:text-white hover:drop-shadow-lg">Eliminar</button>
            </td>
            </tr>
            `
        table.appendChild(tbody);
    }
}