import { ServicioProducto } from "../../Servicio/productoServicio.js";

export class AdminProduct extends HTMLElement {
    #servicio = new ServicioProducto();
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', () => {
            const id = this.#getParameterByName('id');
            if (id) {
                this.#fetchProduct(id)
                    .then(product => {
                        if (product) {
                            this.#render(shadow, product);
                            this.#actualizarProducto(id);
                        } else {
                            window.location.href = 'index.html';
                        }
                    })
            } else {
                window.location.href = 'index.html';
            }
        })
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
        return this.#servicio.obtenerProductoPorId(productId);
    }

    #actualizarProducto(id) {
        const btnUpdate = this.shadowRoot.querySelector('#updateProduct');
        btnUpdate.addEventListener('click', (event) => {
            event.preventDefault();
            const nombre = this.shadowRoot.querySelector('#grid-nombre').value;
            console.log(nombre)
            const categoria = this.shadowRoot.querySelector('#grid-categoria').value;
            const price = this.shadowRoot.querySelector('#grid-precio').value;
            const cantidad = this.shadowRoot.querySelector('#grid-stock').value;
            const imagenurl = this.shadowRoot.querySelector('#grid-img').value;
            const descripcion = this.shadowRoot.querySelector('#grid-descripcion').value;
            if (nombre == '' && categoria == '' && precio == '' && stock == '' && imagenurl == '' && descripcion == '') {
                alert('Faltan campos por llenar');
            } else {
                if (!isNaN(price) && !isNaN(cantidad)) {
                    const precio = parseFloat(price);
                    console.log(precio);
                    const stock = parseInt(cantidad);
                    console.log(cantidad);
                    const productData = { nombre, categoria, precio, stock, imagenurl, descripcion }
                    const respuesta = this.#servicio.actualizarProducto(id, productData);
                    console.log(respuesta);
                    window.location.href = 'admin-products.html';
                } else {
                    alert('Hay caracteres en los campos precio y stock')
                }
            }
        })
    }

    #render(shadow, producto) {
        shadow.innerHTML = `
            <link rel="stylesheet" href="../../components/RegistrarProductoComponent/css/registrarProducto.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
            
            <section class="bg-brown-50">
                <div class="container flex flex-col items-center justify-between max-w-screen-xl p-12 mx-auto md:flex-row bg-brown-50">
                </div>   
                <div class="container flex flex-col items-center justify-center max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="flex flex-col justify-between mb-8 md:mb-0 md:w-fit">
                        <div class="w-full mx-auto">
                            <h1 class="p-8 mt-8 text-4xl font-medium text-center text-brown-100 md:text-5xl font-helvetica">Actualizar producto</h1>
                        </div>
                    </div>
                </div>    
            </section>
            
            <section class="flex flex-col items-center justify-center w-full py-8 bg-brown-400">
                <div class="p-8">
                    <form class="w-full max-w-3xl" method="PUT" enctype="text/plain">
                        <div class="flex flex-wrap mb-6 -mx-3">
                            <div class="w-full px-3 mb-0 md:mb-3">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="nombre">
                                    Nombre *
                                </label>
                                <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-nombre" type="text" placeholder="Café organico" value="${producto.nombre}" required>
                            </div>
                            <div class="w-full px-3 mb-0 md:mb-3">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="categoria">
                                    Categoría *
                                </label>
                                <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-categoria" type="text" placeholder="Café en grano" value="${producto.categoria}" required>
                            </div>
                            <div class="w-full px-3 mb-0 md:mb-3">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="precio">
                                    Precio *
                                </label>
                                <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-precio" type="text" value="${producto.precio}" required>
                            </div>
                            <div class="w-full px-3 mb-0 md:mb-3">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="stock">
                                    Stock *
                                </label>
                                <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-stock" type="text" placeholder="Cantidad" value="${producto.stock}" required>
                            </div>
                            <div class="w-full px-3 mb-0 md:mb-3" id="drop-area">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="imagen">
                                    Imagen *
                                </label>
                                <button id="fileInputBtn" class="px-4 py-2 font-bold transition duration-200 rounded shadow bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white focus:shadow-outline focus:outline-none">
                                    Seleccionar archivo
                                </button>
                                <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-img" type="file" placeholder="Arrastre y suelte un archivo" required>
                                <ul id="fileList" class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300"></ul>
                            </div>
                            <div class="w-full px-3 mb-0 md:mb-3">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="descripcion">
                                    Descripción *
                                </label>
                                <textarea class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-descripcion" value="${producto.descripcion}" required></textarea>
                            </div>
                        </div>
                        <div class="md:flex md:items-center">
                            <div class="md:w-1/3">
                                <button id="updateProduct" class="px-4 py-2 font-bold transition duration-200 rounded shadow bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white focus:shadow-outline focus:outline-none">
                                    Actualizar producto
                                </button>
                            </div>
                            <div class="md:w-2/3"></div>
                        </div>
                    </form>
                    <div class="md:w-1/3">
                        <a href="admin-products.html" class="px-4 py-2 font-bold transition duration-200 rounded shadow bg-red-600 text-brown-50 hover:bg-brown-300 hover:text-white focus:shadow-outline focus:outline-none" type="submit">
                            Cancelar
                        </a>
                    </div>
                </div>
            </section>
        `
    }
}