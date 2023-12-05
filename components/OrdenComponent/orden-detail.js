import { ServicioProducto } from "../../Servicio/productoServicio.js";
import { ServicioUsuario } from "../../Servicio/usuarioServicio.js";
import { ServicioCookie } from "../../Servicio/cookieServicio.js";
import { ServicioOrden } from "../../Servicio/ordenServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class OrdenDetail extends HTMLElement {
    #servicioProducto = new ServicioProducto();
    #servicioOrden = new ServicioOrden();
    #servicioUsuario = new ServicioUsuario();
    #cookie = new ServicioCookie();
    #usuarioPerfil = null;
    #orden = null;
    #productosOrden = null;

    constructor() {
        super()
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', async () => {
            const orderId = this.#getParameterByName('id');
            const cookieUser = this.#getCookie();
                if (cookieUser) {
                    const cookieDecoded = this.#cookie.decodeJwt(cookieUser); // Decodifica la cookie con JWT

                    const usuarioId = cookieDecoded.idUsuario; //obtiene el id del usuario desde el token, agregar en los otros componentes
                    await this.#fetchUser(usuarioId)
                        .then(async usuario => {
                            if (usuario && usuario.message !== 'No se logró obtener el usuario') {
                                usuario.token = JSON.parse(cookieUser).token;
                                this.#usuarioPerfil = usuario;
                                if (orderId) {
                                    await this.#fetchOrder(orderId, this.#usuarioPerfil.token)
                                        .then(orders => {
                                            if (orders && orders.message !== 'No se pudo encontrar la orden') {
                                                this.#orden = orders;
                                                this.#productosOrden = orders.productos;
                                                this.#render(shadow, this.#productosOrden, this.#orden);
                                                this.#initPrintReceipt(shadow, this.#productosOrden, this.#orden);
                                            } else {
                                                window.location.href = '../../src/orders.html';
                                            }
                                        });
                                } else {
                                    window.location.href = '../../src/orders.html';
                                }
                            } else {
                                window.location.href = `../../src/login.html`;
                            }
                        });
                } else {
                    window.location.href = '../../src/login.html';
                }

                
            });        
    }

    #fetchOrder(idOrden, token) {
        return this.#servicioOrden.obtenerOrdenesPorId(idOrden, token);
    }

    #fetchUser(idUsuario){
        return this.#servicioUsuario.obtenerUsuarioPorId(idUsuario);
    }

    #getCookie() {
        return this.#cookie.getCookie('usuario');
    }

    #getParameterByName(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    #render(shadow, productos, orden) {
        shadow.innerHTML = `
        <style>
        /* Chrome, Safari, Edge, Opera */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
        }

        /* Firefox */
        input[type=number] {
        -moz-appearance: textfield;
        }
        </style>
        
        <link rel="stylesheet" href="../../components/OrdenComponent/css/orden-detail.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

        <section class="bg-brown-50">
            <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="w-full mb-6">
                        <h1 class="text-brown-100 text-4xl md:text-5xl mt-6 p-8 text-center font-medium font-helvetica">Detalle de orden</h1>
                    </div>
            </div>       
        
            <div class="mx-auto bg-brown-400 w-full md:pb-60" id="cartDiv">
                <div class="bg-brown-400 pt-8 md:max-w-7xl mx-auto">
                    <div class="mx-auto max-w-6xl justify-center px-6 md:flex md:space-x-6 xl:px-0 pb-8">
                    <div class="rounded-lg md:w-2/4">
                        ${productos.length > 0 ? productos.map(product => this.#renderOrders(product)).join('') :
                            `<div class="mt-6 rounded-lg border bg-brown-25 p-8 shadow-md md:mt-0">
                                <p class="text-brown-100 font-helvetica md:text-2xl text-xl">
                                    Esta orden está vacía.
                                </p>
                                <a href="../../src/orders.html"><button class="mt-6 w-full px-8 md:px-4 md:w-fit rounded-md bg-brown-100 py-1.5 font-medium text-brown-25 transition-all duration-150 hover:text-white hover:bg-brown-300"><i class="fas fa-shopping-cart mr-2 text-white"></i>Ir a las ordenes</button></a>
                            </div>
                            `
                        }
                        
                    </div>

                    <!-- Sub total -->
                    <div class="mt-6 h-full rounded-lg border bg-brown-25 p-6 shadow-md md:mt-0 md:w-2/4">
                        ${this.#renderOrderDetail(orden)}
                    </div>
                </div>
            </div>
        </section>
        `
    }

    #renderOrders(product) {
        let imageUrl = null;
        if (product.imagenurl.includes('http')) {
            imageUrl = product.imagenurl;
        } else {
            imageUrl = `../../img/${product.imagenurl}`;
        }

        return `
        <div class="justify-between mb-6 rounded-lg bg-brown-25 p-6 shadow-md sm:flex sm:justify-start">
        <div class="sm:w-36 md:mr-2 w-full hover:scale-110 transition-all duration-200">
            <a href="../../src/orders.html">
                <img src="${imageUrl}" alt="product-image" class="rounded-lg"/>
            </a>
        </div>    
        
        <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
            <div class="mt-5 sm:mt-0 text-brown-300">
                <h2 class="text-lg md:text-xl font-bold">${product.nombre}</h2>
                <p class="mt-1 text-md md:text-md">${product.categoria}</p>
                <p class="mt-1 text-md md:text-md">Cantidad ordenada: ${product.cantidadCarrito}</p>
                <p class="mt-4 text-md md:text-md"><strong>Precio:</strong> $${product.precio}</p>
                <p class="mt-1 text-md md:text-md"><strong>Total:</strong> $${product.precio * product.cantidadCarrito}</p>
            </div>
        </div>
    </div>
        `
    }

    #renderOrderDetail(orden) {

        const total = orden.total;
        const totalSinIva = total / 1.16;
        const IVA = totalSinIva * 0.16;

        return `
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg"><strong>Subtotal</strong></p>
            <p class="text-brown-300 text-md md:text-lg">$${totalSinIva.toFixed(2)}</p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg"><strong>Subtotal</strong></p>
            <p class="text-brown-300 text-md md:text-lg">$${IVA.toFixed(2)}</p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg"><strong>Total</strong></p>
            <p class="text-brown-300 text-md md:text-lg">$${total.toFixed(2)}</p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg"><strong>Método de pago</strong></p>
            <p class="text-brown-300 text-md md:text-lg">${orden.metodoPago}</p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg"><strong>Nombre</strong></p>
            <p class="text-brown-300 text-md md:text-lg">${this.#usuarioPerfil.nombre}</p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg"><strong>Dirección</strong></p>
            <p class="text-brown-300 text-md md:text-lg">${orden.direccionEnvio}</p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg"><strong>Estado</strong></p>
            <p class="text-brown-300 text-md md:text-lg">${orden.estado}</p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg"><strong>Fecha</strong></p>
            <p class="text-brown-300 text-md md:text-lg">${orden.fechaOrden}</p>
        </div>
        <button id="btnPrintReceipt" class="mt-6 w-full rounded-md bg-brown-100 py-1.5 font-medium text-brown-25 transition-all duration-150 hover:text-white hover:bg-brown-300"><i class="fas fa-print mr-2 text-white"></i>Imprimir recibo</button>
        `
    }

    #initPrintReceipt(shadow, productos, orden) {
        const btnPrintReceipt = shadow.getElementById('btnPrintReceipt');
        btnPrintReceipt.addEventListener('click', () => {
            this.#printReceipt(productos, orden);
        });
    }

    #printReceipt() {
        window.print();
    }
}