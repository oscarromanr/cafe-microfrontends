import { ServicioProducto } from "../../Servicio/productoServicio.js";
import { LocalStorageService } from "../../Servicio/LocalStorageService.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class Cart extends HTMLElement {
    #servicio = new ServicioProducto();
    #products = [];

    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', async () => {
            const cart = JSON.parse(LocalStorageService.getItem('carrito'));
            if (cart && cart.length > 0) {
                for (const product of cart) {
                    const response = await this.#fetchProduct(product.id);
                    response.cantidadCarrito = product.cantidad;
                    response.precioTotal = response.precio * response.cantidadCarrito;
                    this.#products.push(response);
                }
            }
            this.#render(shadow, this.#products);
        });
    }

    #fetchProduct(productId) {
        return this.#servicio.obtenerProductoPorId(productId);
    }

    #render(shadow, products){
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
        
        <link rel="stylesheet" href="../../components/CartComponent/css/cart.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

        <section class="bg-brown-50">
            <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="w-full mb-6">
                        <h1 class="text-brown-100 text-4xl md:text-5xl mt-6 p-8 text-center font-medium font-helvetica">Carrito de compra</h1>
                    </div>
            </div>       
        
            <div class="mx-auto bg-brown-400 w-full md:pb-72" id="cartDiv">
                <div class="bg-brown-400 pt-8 md:max-w-7xl mx-auto">
                    <div class="mx-auto max-w-6xl justify-center px-6 md:flex md:space-x-6 xl:px-0 pb-8">
                    <div class="rounded-lg md:w-2/3">
                        ${products.length > 0 ? products.map(product => this.#renderCartProduct(product)).join('') : 
                            `<div class="mt-6 rounded-lg border bg-brown-25 p-8 shadow-md md:mt-0">
                                <p class="text-brown-100 font-helvetica md:text-2xl text-xl">
                                    Actualmente no cuentas con productos en el carrito.
                                </p>
                                <a href="catalogo.html"><button class="mt-6 w-full px-8 md:px-4 md:w-fit rounded-md bg-brown-100 py-1.5 font-medium text-brown-25 transition-all duration-150 hover:text-white hover:bg-brown-300"><i class="fas fa-shopping-cart mr-2 text-white"></i>Ir al catálogo</button></a>
                            </div>
                            `
                        }
                        
                    </div>

                    <!-- Sub total -->
                    <div class="mt-6 h-full rounded-lg border bg-brown-25 p-6 shadow-md md:mt-0 md:w-1/3">
                        ${products.length > 0 ? this.#renderSubTotal(products) : this.#renderSubTotalEmpty() }
                    </div>
                </div>
            </div>
        </section>
        `;

        if (products.length > 0) {
            this.#initButtons(shadow, products);
        }

        if (products.length > 2) {
            const cartDiv = shadow.querySelector('#cartDiv');
            cartDiv.classList.remove('md:pb-72');
        }
    }

    #renderCartProduct(product){
        let imageUrl = null;
        if (product.imagenurl.includes('http')) {
            imageUrl = product.imagenurl;
        } else {
            imageUrl = `../../img/${product.imagenurl}`;
        }

        return `
        <div class="justify-between mb-6 rounded-lg bg-brown-25 p-6 shadow-md sm:flex sm:justify-start">
            <div class="sm:w-36 md:mr-2 w-full hover:scale-110 transition-all duration-200">
                <a href="product-detail.html?id=${product._id}">
                    <img src="${imageUrl}" referrerpolicy="no-referrer" alt="product-image" class="rounded-lg"/>
                </a>
            </div>    
            
            <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                <div class="mt-5 sm:mt-0 text-brown-300">
                    <h2 class="text-lg md:text-xl font-bold ">${product.nombre}</h2>
                    <p class="mt-1 text-md md:text-md">${product.categoria}</p>
                    <p class="mt-1 text-md md:text-md">Stock: ${product.stock}</p>
                    <p class="mt-4 text-md md:text-md"><strong>Precio:</strong> $${product.precio.toFixed(2)}</p>
                    <p class="mt-1 text-md md:text-md"><strong>Total:</strong> $${product.precioTotal.toFixed(2)}</p>
                </div>
                <div class="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <div class="flex items-center border-gray-100">
                        <span class="cursor-pointer rounded-l bg-brown-100 py-1 px-3.5 duration-100 hover:bg-brown-300 btnMinus text-white"><i class="text-sm fas fa-minus"></i></span>
                        <input class="h-8 w-12 border bg-white text-center text-md outline-none" disabled type="number" value="${product.cantidadCarrito}" min="1" />
                        <span class="cursor-pointer rounded-r bg-brown-100 py-1 px-3 duration-100 hover:bg-brown-300 btnPlus text-white"><i class="text-sm fas fa-plus"></i></span>
                        <span class="ml-4 cursor-pointer rounded bg-brown-100 py-1 px-3 duration-100 hover:bg-brown-300 btnDelete text-white"><i class="fas fa-trash-alt"></i></span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    #renderSubTotal(products) {
        let subtotal = 0;
        let total = 0;
        let iva = 0;
        for (const product of products) {
            subtotal += product.precioTotal;
        }
        iva = subtotal * 0.16;

        total = subtotal + iva;

        return `
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">Subtotal</p>
            <p class="text-brown-300 text-md md:text-lg">$${subtotal.toFixed(2)}</p>
        </div>
        <div class="flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">IVA</p>
            <p class="text-brown-300 text-md md:text-lg">$${iva.toFixed(2)}</p>
        </div>
        <div class="w-full my-3 border-t border-brown-300 text-brown-300 opacity-75"></div>
            <div class="flex justify-between">
                <p class="text-lg md:text-xl font-bold text-brown-300">Total</p>
                <div class="">
                    <p class="mb-1 text-lg md:text-xl font-bold text-brown-300">$${total.toFixed(2)}</p>
                </div>
            </div>
            <button class="mt-6 w-full rounded-md bg-brown-100 py-1.5 font-medium text-brown-25 transition-all duration-150 hover:text-white hover:bg-brown-300"><i class="fas fa-bag-shopping mr-2 text-white"></i>Comprar ahora</button>
        </div>
        `;
    }

    #renderSubTotalEmpty(){
        return `
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">Subtotal</p>
            <p class="text-brown-300 text-md md:text-lg">$0</p>
        </div>
        <div class="flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">IVA</p>
            <p class="text-brown-300 text-md md:text-lg">$0</p>
        </div>
        <div class="w-full my-3 border-t border-brown-300 text-brown-300 opacity-75"></div>
            <div class="flex justify-between">
                <p class="text-lg md:text-xl font-bold text-brown-300">Total</p>
                <div class="">
                    <p class="mb-1 text-lg md:text-xl font-bold text-brown-300">$0</p>
                </div>
            </div>
        </div>
        `;
    }

    #initButtons(shadow, products){
        const btnPlusElements = shadow.querySelectorAll('.btnPlus');
        const btnMinusElements = shadow.querySelectorAll('.btnMinus');
        const btnDeleteElements = shadow.querySelectorAll('.btnDelete');

        const cart = JSON.parse(LocalStorageService.getItem('carrito'));

        btnPlusElements.forEach((btnPlus, index) => {
            btnPlus.addEventListener('click', () => {
                if (products[index].stock > cart[index].cantidad) {
                    cart[index].cantidad++;
                    LocalStorageService.setItem('carrito', JSON.stringify(cart));
                    location.reload();
                } else {
                    Swal.fire({
                        title: '¡Error!',
                        text: "No hay suficiente stock",
                        icon: 'error',
                        confirmButtonColor: '#815F51',
                        background: '#F9F5F3', 
                        iconColor: '#815F51',
                        color: '#36241C',
                        confirmButtonText: 'Cerrar',
                        confirmButtonAriaLabel: 'Cerrar'
                    });
                }
            });
        });

        btnMinusElements.forEach((btnMinus, index) => {
            btnMinus.addEventListener('click', () => {
                if (cart[index].cantidad > 1) {
                    cart[index].cantidad--;
                    LocalStorageService.setItem('carrito', JSON.stringify(cart));
                    location.reload();
                } else {
                    // remove the product from the cart
                    cart.splice(index, 1);
                    LocalStorageService.setItem('carrito', JSON.stringify(cart));
                    location.reload();
                }
            });
        });

        btnDeleteElements.forEach((btnDelete, index) => {
            btnDelete.addEventListener('click', () => {
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "No podrás recuperar el producto del carrito",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#815F51',
                    cancelButtonColor: '#d33',
                    background: '#F9F5F3', 
                    iconColor: '#815F51',
                    color: '#36241C',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonAriaLabel: 'Sí, eliminar',
                    cancelButtonAriaLabel: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        cart.splice(index, 1);
                        LocalStorageService.setItem('carrito', JSON.stringify(cart));
                        location.reload();
                    }
                });
            });
        });
    }
}