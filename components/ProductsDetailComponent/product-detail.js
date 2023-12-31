import { ServicioProducto } from "../../Servicio/productoServicio.js";
import { ServicioUsuario } from "../../Servicio/usuarioServicio.js";
import { ServicioCookie } from "../../Servicio/cookieServicio.js";
import { ServicioOrden } from "../../Servicio/ordenServicio.js";
import { LocalStorageService } from "../../Servicio/LocalStorageService.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class ProductDetails extends HTMLElement {
    #servicioProducto = new ServicioProducto();
    #servicioOrden = new ServicioOrden();
    #servicioUsuario = new ServicioUsuario();
    #cookie = new ServicioCookie();
    #usuarioPerfil = null;

    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', async () => {
            const productId = this.#getParameterByName('id');
            const cookieUser = this.#getCookie();

            if (cookieUser) {
                const cookieDecoded = this.#cookie.decodeJwt(cookieUser); 

                const usuarioId = cookieDecoded.idUsuario; 
                await this.#fetchUser(usuarioId)
                    .then(usuario => {
                        if (usuario && usuario.message !== 'No se logró obtener el usuario') {
                            usuario.token = JSON.parse(cookieUser).token;
                            this.#usuarioPerfil = usuario;
                        } 
                    });
            }

            if (productId) {
                await this.#fetchProduct(productId)
                    .then(product => {
                        if (product) {
                            this.#render(shadow, product);
                            this.#initControls(shadow, product);
                        } else {
                            window.location.href = '../../src/index.html';
                        }
                    });
            } else {
                window.location.href = '../../src/index.html';
            }
        });
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

    #fetchProduct(productId) {
        return this.#servicioProducto.obtenerProductoPorId(productId);
    }

    #render(shadow, producto) {
        let imageUrl = null;
        if (producto.imagenurl.includes('http')) {
            imageUrl = producto.imagenurl;
        } else {
            imageUrl = `../../img/${producto.imagenurl}`;
        }

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
        <link rel="stylesheet" href="../../components/ProductsDetailComponent/css/product-detail.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
        
        <section class="bg-brown-50">
            <div class="container flex flex-col p-16 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            
            <div class="mx-auto bg-brown-50 w-full max-h-full h-full">
                <div class="flex flex-col md:flex-row w-full px-6 md:max-w-7xl mx-auto mt-4 mb-4">
                    <div class="md:w-1/3 md:pr-8">
                        <img src="${imageUrl}" referrerpolicy="no-referrer" id="productImg" alt="Product Image" class="mx-auto w-full hover:scale-110 duration-150 transition-all rounded-lg drop-shadow-lg">
                    </div>
                    <div class="md:w-2/3 mt-4 md:mt-0">
                        <div class="bg-brown-25 p-6 font-helvetica rounded-lg drop-shadow-lg">
                            <h2 class="text-3xl font-bold text-brown-300 mb-6">${producto.nombre}</h2>
                            <p class="text-brown-300 text-xl mb-2"><strong>Precio:</strong> $${producto.precio}</p>
                            <p class="text-brown-300 text-xl mb-6"><strong>Categoría:</strong> ${producto.categoria}</p>
                            <p class="text-brown-300 text-xl mb-6"><strong>Descripción:</strong> ${producto.descripcion}</p>
                            <p class="text-brown-300 text-xl mb-4"><strong>Cantidad disponible:</strong> ${producto.stock}</p>
                            <div class="flex items-center mt-4 mb-8 md:mb-16">
                                <button class="bg-brown-100 text-brown-25 px-2 py-1 rounded-l hover:bg-brown-300 transition-all hover:drop-shadow-lg" id="btnMinus">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" id="productQty" class="w-16 font-roboto text-md text-center border border-gray-300 px-2 py-1" value="1" min="1" max="${producto.stock}">
                                <button class="bg-brown-100 text-brown-25 px-2 py-1 rounded-r hover:bg-brown-300 transition-all hover:drop-shadow-lg" id="btnPlus">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="flex justify-between mt-4 md:mt-8">
                                <button id="btnBuyNow" class="bg-brown-100 font-medium text-lg font-helvetica p-2 transition-all scroll-smooth text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg px-4 py-2 rounded w-1/2 mr-2"><i class="fas fa-bag-shopping mr-2"></i>Comprar ahora</button>
                                <button id="btnAddToCart" class="bg-brown-100 font-medium text-lg font-helvetica p-2 transition-all scroll-smooth text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg px-4 py-2 rounded w-1/2 mr-2"><i class="fas fa-cart-shopping mr-2"></i>Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="container flex flex-col p-4 md:p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div> 
        </section>
        `;
    }

    #initControls(shadow, product) {
        const btnMinus = shadow.querySelector('#btnMinus');
        const btnPlus = shadow.querySelector('#btnPlus');
        const productQty = shadow.querySelector('#productQty');

        productQty.addEventListener('change', () => {
            if (productQty.value < 1) {
                productQty.value = 1;
            } else if (productQty.value > product.stock) {
                productQty.value = product.stock;
            }
        });

        productQty.addEventListener('keydown', (event) => {
            if (event.key === '-' || event.key === 'e' || event.key === '.') {
                event.preventDefault();
            } 
        });

        btnMinus.addEventListener('click', () => {
            if (productQty.value > 1) {
                productQty.value--;
            }
        });

        btnPlus.addEventListener('click', () => {
            
            if (productQty.value < product.stock){
                productQty.value++;
            }
        });

        const btnAddToCart = shadow.querySelector('#btnAddToCart');
        const btnBuyNow = shadow.querySelector('#btnBuyNow');

        btnBuyNow.addEventListener('click', () => {
            
            const subtotal = product.precio * productQty.value;
            const iva = subtotal * 0.16;
            const totalProducto = subtotal + iva;

            Swal.fire({
                title: '¿Estás seguro?',
                text: "¿Deseas comprar este producto?, el total es de $" + totalProducto.toFixed(2) + " (IVA incluido)",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#815F51',
                cancelButtonColor: '#E53E3E',
                confirmButtonText: 'Sí, comprar ahora',
                cancelButtonText: 'Cancelar',
                background: '#F9F5F3', 
                iconColor: '#815F51',
                color: '#36241C'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (this.#usuarioPerfil === null) {
                        Swal.fire({
                            title: 'No has iniciado sesión',
                            text: "Necesitas iniciar sesión para comprar ahora",
                            icon: 'error',
                            confirmButtonColor: '#815F51',
                            background: '#F9F5F3', 
                            iconColor: '#815F51',
                            color: '#36241C',
                            showCancelButton: true,
                            cancelButtonText: 'Cancelar',
                            cancelButtonColor: '#E53E3E',
                            confirmButtonText: 'Ir al inicio de sesión',
                            confirmButtonAriaLabel: 'Ir al inicio de sesión'
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                                return;
                            }
                            window.location.href = '../../src/login.html';
                        })     
                    } else {
                        product.cantidadCarrito = 1;
                        const productoArray = [product];

                        const subtotal = product.precio * productQty.value;
                        const iva = subtotal * 0.16;
                        const totalProducto = subtotal + iva;

                        const direccion = this.#usuarioPerfil.calle + ' ' + this.#usuarioPerfil.numerocasa + ', ' + this.#usuarioPerfil.colonia + '.';

                        const orden = {
                            idUsuario: this.#usuarioPerfil._id,
                            fechaOrden: new Date(),
                            estado: 'En proceso',
                            total: totalProducto,
                            productos: productoArray,
                            direccionEnvio: direccion,
                            metodoPago: 'Tarjeta de crédito'
                        }


                        const response = await this.#servicioOrden.crearOrden(orden.idUsuario, orden.fechaOrden, orden.estado, orden.total, orden.productos, orden.direccionEnvio, orden.metodoPago, this.#usuarioPerfil.token)

                        if (response.message === 'Orden creada exitosamente') {
                            Swal.fire({
                                title: '¡Compra realizada!',
                                text: "Tu compra se ha realizado exitosamente",
                                icon: 'success',
                                confirmButtonColor: '#815F51',
                                background: '#F9F5F3', 
                                iconColor: '#815F51',
                                color: '#36241C',
                                showCancelButton: true,
                                cancelButtonText: 'Cerrar',
                                cancelButtonColor: '#E53E3E',
                                confirmButtonText: 'Ir a las compras',
                                confirmButtonAriaLabel: 'Ir a las compras'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '../../src/orders.html';
                                } else {
                                    location.reload();
                                }
                            })
                        } else {
                            Swal.fire({
                                title: '¡Error!',
                                text: "No se pudo crear la orden",
                                icon: 'error',
                                confirmButtonColor: '#815F51',
                                background: '#F9F5F3', 
                                iconColor: '#815F51',
                                color: '#36241C',
                                confirmButtonText: 'Ok',
                                confirmButtonAriaLabel: 'Ok'
                            }).then((result) => {
                                if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.timer || result.dismiss === Swal.DismissReason.close || result.dismiss === Swal.DismissReason.overlayClick || result.dismiss === Swal.DismissReason.popupClick || result.dismiss === Swal.DismissReason.cancel) {
                                    location.reload();
                                }
                            })
                        
                        }
                    }
                }
            })});
        
            btnAddToCart.addEventListener('click', () => {
                const productId = this.#getParameterByName('id');
                const productQty = shadow.querySelector('#productQty').value;

                if (productQty >= 1 && productQty <= product.stock && product.stock > 0) {
                    if (this.#addToCart(productId, productQty, product.stock)){
                        Swal.fire({
                            title: '¡Producto agregado!',
                            text: "Tu producto se ha agregado al carrito",
                            icon: 'success',
                            confirmButtonColor: '#815F51',
                            background: '#F9F5F3', 
                            iconColor: '#815F51',
                            color: '#36241C',
                            showCancelButton: true,
                            cancelButtonText: 'Cerrar',
                            cancelButtonColor: '#E53E3E',
                            confirmButtonText: 'Ir al carrito',
                            confirmButtonAriaLabel: 'Ir al carrito'
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.cancel || result.dismiss === Swal.DismissReason.backdrop) {
                                return;
                            }
                            window.location.href = 'cart.html';
                        })     
                    } else {
                        Swal.fire({
                            title: '¡Error!',
                            text: "No hay suficiente stock, revise su carrito",
                            icon: 'error',
                            confirmButtonColor: '#815F51',
                            background: '#F9F5F3', 
                            iconColor: '#815F51',
                            color: '#36241C',
                            showCancelButton: true,
                            cancelButtonText: 'Cerrar',
                            cancelButtonColor: '#E53E3E',
                            confirmButtonText: 'Ir al carrito',
                            confirmButtonAriaLabel: 'Ir al carrito'
                        }).then((result) => {
                            if (result.dismiss === Swal.DismissReason.cancel) {
                                return;
                            }
                            window.location.href = 'cart.html';
                        })
                    }
                } else {
                    // No se pudo agregar el producto al carrito
                    Swal.fire({
                        title: '¡Error!',
                        text: "No se pudo agregar el producto al carrito",
                        icon: 'error',
                        confirmButtonColor: '#E53E3E',
                        background: '#F9F5F3', 
                        iconColor: '#815F51',
                        color: '#36241C',
                        confirmButtonText: 'Ok',
                        confirmButtonAriaLabel: 'Ok'
                    }).then((result) => {
                        if (result.dismiss === Swal.DismissReason.cancel) {
                            return;
                        }
                    })
                }
            });
    }

    #addToCart(productId, productQty, stock) {
        const cart = JSON.parse(LocalStorageService.getItem('carrito')) || [];
        const existingProduct = cart.find(item => item.id === productId);
        if (existingProduct) {
            const cantidad = existingProduct.cantidad + parseInt(productQty);
            if (!(cantidad > stock)) {
                existingProduct.cantidad += parseInt(productQty);
            } else {
                return false;
            }
        } else {
            const product = {
                id: productId,
                cantidad: parseInt(productQty)
            };

            if (!(product.cantidad > stock)) {
                cart.push(product);    
            } else {
                return false;
            }
        }
        LocalStorageService.setItem('carrito', JSON.stringify(cart));
        return true;
    }

    
}