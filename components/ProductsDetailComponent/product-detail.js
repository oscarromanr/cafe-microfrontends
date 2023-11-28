import { ServicioProducto } from "../../Servicio/productoServicio.js";

export class ProductDetails extends HTMLElement {
    #servicio = new ServicioProducto();
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', () => {
            this.#render(shadow);
            this.#initControls(shadow);
            this.#imageZoom(shadow);
            // this.#consultaUsuarios(shadow);
        });
    }

    #render(shadow) {
        shadow.innerHTML = `
        <link rel="stylesheet" href="../../components/ProductsDetailComponent/css/product-detail.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
        
        <section class="bg-brown-50">
            <div class="container flex flex-col p-16 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            
            <div class="mx-auto bg-brown-50 w-full">
                <div class="flex flex-col md:flex-row w-full px-6 md:max-w-7xl mx-auto mt-4 mb-4">
                    <div class="md:w-1/3 md:pr-8">
                        <img src="../../img/cafe-250.png" id="productImg" alt="Product Image" class="mx-auto w-full rounded-lg drop-shadow-lg">
                    </div>
                    <div class="md:w-2/3 mt-4 md:mt-0">
                        <div class="bg-brown-25 p-4 font-helvetica rounded-lg drop-shadow-lg">
                            <h2 class="text-3xl font-bold text-brown-300 mb-6">Café Orgánico Tostado 250 gr</h2>
                            <p class="text-brown-300 text-xl mb-2"><strong>Precio:</strong> $140</p>
                            <p class="text-brown-300 text-xl mb-6"><strong>Categoría:</strong> Café en grano</p>
                            <p class="text-brown-300 text-xl mb-6"><strong>Descripción:</strong> Presentación de 250 gramos. Cosechado en los altos de la Sierra de Zongolica, de manera artesanal por manos de indígenas náhuatl. Café Tatiaxca de grano arábiga y tueste medio, con gran aroma, cuerpo y acidez. Excelente calidad 100% Orgánico.</p>
                            <p class="text-brown-300 text-xl mb-4"><strong>Cantidad disponible:</strong> 20</p>
                            <div class="flex items-center mt-4 mb-8 md:mb-16">
                                <button class="bg-brown-100 text-brown-25 px-2 py-1 rounded-l hover:bg-brown-300 transition-all hover:drop-shadow-lg" id="btnMinus">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" id="productQty" class="w-16 font-roboto text-md text-center border border-gray-300 px-2 py-1" value="1">
                                <button class="bg-brown-100 text-brown-25 px-2 py-1 rounded-r hover:bg-brown-300 transition-all hover:drop-shadow-lg" id="btnPlus">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="flex justify-between mt-4 md:mt-8">
                                <button class="bg-brown-100 font-medium text-lg font-helvetica p-2 transition-all scroll-smooth text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg px-4 py-2 rounded w-1/2 mr-2"><i class="fas fa-cart-shopping mr-2"></i>Comprar ahora</button>
                                <button class="bg-brown-100 font-medium text-lg font-helvetica p-2 transition-all scroll-smooth text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg px-4 py-2 rounded w-1/2 mr-2"><i class="fas fa-cart-shopping mr-2"></i>Agregar al carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container flex flex-col p-4 md:p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div> 
        </section>

        `
    }

    #initControls(shadow) {
        const btnMinus = shadow.querySelector('#btnMinus');
        const btnPlus = shadow.querySelector('#btnPlus');
        const productQty = shadow.querySelector('#productQty');

        btnMinus.addEventListener('click', () => {
            if (productQty.value > 1) {
                productQty.value--;
            }
        });

        btnPlus.addEventListener('click', () => {
            productQty.value++;
        });
    }

    //adds a simple zoom effect to the product image when hovering over it
    #imageZoom(shadow) {
        const productImg = shadow.querySelector('#productImg');
        productImg.addEventListener('mouseover', () => {
            productImg.classList.add('transform', 'scale-110', 'transition-all', 'duration-200');
        });
        productImg.addEventListener('mouseout', () => {
            productImg.classList.remove('transform', 'scale-110', 'transition-all', 'duration-200');
        });
    }

    // #consultaUsuarios(shadow) {
    //     this.#servicio.obtenerUsuarios()
    //         .then(users => {
    //             let table = shadow.querySelector('#tabla');
    //             let tbody = document.createElement('tbody');
    //             const usuarios = users;
    //             usuarios.forEach(element => {
    //                 this.#despliegaUsuario(table, tbody, element);
    //             });
    //         })
    // }

    // #despliegaUsuario(table, tbody, usuario) {
    //     tbody.innerHTML +=
    //         `   
    //         <tr class="bg-brown-25 text-brown-300 font-roboto">
    //         <td class="py-2 px-4 border-b">${usuario.nombre}</td>
    //         <td class="py-2 px-4 border-b">${usuario.email}</td>
    //         <td class="py-2 px-4 border-b">${usuario.calle}</td>
    //         <td class="py-2 px-4 border-b">${usuario.numerocasa}</td>
    //         <td class="py-2 px-4 border-b">${usuario.colonia}</td>
    //         <td class="py-2 px-4 border-b">${usuario.telefono}</td>
    //         <td class="py-2 px-4 border-b">
    //            <button class="bg-red-600 font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-25 hover:bg-red-900 hover:text-white hover:drop-shadow-lg">Eliminar</button>
    //         </td>

    //         </tr>
    //         `
    //     table.appendChild(tbody);
    // }
}