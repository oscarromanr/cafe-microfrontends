import { ServicioProducto } from "../../Servicio/productoServicio.js";
import { ServicioAdministrador } from "../../Servicio/adminServicio.js";
import { ServicioCookie } from "../../Servicio/cookieServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";


export class AdminProducts extends HTMLElement {
    #servicioProducto = new ServicioProducto();
    #servicioAdmin = new ServicioAdministrador();
    #cookie = new ServicioCookie();
    #adminPerfil = null;
    #cantidadProductos = null;


    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', () => {
            const cookieAdmin = this.#getCookie();

            if (cookieAdmin) {
                const cookieDecoded = this.#cookie.decodeJwt(cookieAdmin);

                const adminId = cookieDecoded.idAdministrador;
                this.#fetchAdmin(adminId)
                    .then(admin => {
                        if (admin && admin.message !== 'No se logró obtener el administrador') {
                            admin.token = JSON.parse(cookieAdmin).token;
                            this.#adminPerfil = admin;
                            this.#render(shadow);
                            this.#consultaProductos(shadow);
                        } else {
                            window.location.href = `../../src/admin-login.html`;
                        }
                    });
            } else {
                window.location.href = '../../src/admin-login.html';
            }
        });
    }

    #fetchAdmin(idAdmin){
        return this.#servicioAdmin.obtenerAdminPorId(idAdmin);
    }

    #getCookie() {
        return this.#cookie.getCookie('admin');
    }

    #render(shadow) {
        shadow.innerHTML = `
        <link rel="stylesheet" href="../../components/AdminProducts/css/admin-products.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
        
        <section class="bg-brown-50">
            <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="w-full mb-6">
                        <h1 class="text-brown-100 text-4xl md:text-5xl mt-8 p-8 text-center font-medium font-helvetica">Lista de productos</h1>
                    </div>
            </div>       

            <div class="z-10 p-8 w-full md:pb-72 bg-brown-400" id="tableDiv">
                <div class="mt-6 rounded-lg border bg-brown-25 w-full max-w-6xl mx-auto p-8 shadow-md md:mt-0 hidden" id="avisoProducts">
                    <p class="text-brown-100 font-helvetica md:text-2xl text-xl">
                        Actualmente no existen productos registrados.
                    </p>
                </div>
                <div class="overflow-x-auto">
                    <table class="p-8 bg-brown-50 mb-4 w-full max-w-6xl md:p-6 mx-auto table-auto rounded text-lg" id="tabla">
                        <thead>
                            <tr>
                                <th class="py-1 px-2 text-left border-b bg-brown-100 text-brown-50 hidden">ID</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Imagen</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Nombre</th>
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
                    <a class="bg-brown-100 font-medium text-lg font-helvetica p-4 transition-all rounded scroll-smooth md:mr-4 text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg" href="../../src/admin-register-product.html"><i class="fa fa-plus mr-2"></i> Registrar nuevo producto</a>
                </div>
            </div>
        </section>

        `
    }

    #consultaProductos(shadow) {
        this.#servicioProducto.obtenerProductos()
            .then(products => {
                let table = shadow.querySelector('#tabla');
                let tbody = document.createElement('tbody');
                const productos = products.productos;
                this.#cantidadProductos = productos.length;
                productos.forEach(element => {
                    this.#despliegaProducto(table, tbody, element);
                });
            }).then(() => {
                this.#initDeleteButtons(shadow);

                if (this.#cantidadProductos <= 0) {
                    const table = shadow.querySelector('#tabla');
                    const aviso = shadow.querySelector('#avisoProducts');
                    aviso.classList.remove('hidden');
                    table.classList.add('hidden');
                } 

                if (this.#cantidadProductos > 3) {
                    const tableDiv = shadow.querySelector('#tableDiv');
                    tableDiv.classList.remove('md:pb-72');
                }
            })
    }

    #initDeleteButtons(shadow) {
        const btnEliminar = shadow.querySelectorAll('.btnDelete');
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
                    confirmButtonText: 'Si, eliminar',
                    cancelButtonText: 'Cancelar',
                    background: '#F9F5F3',
                    iconColor: '#815F51',
                    color: '#36241C'
                }).then(async (result) => {
                    if(result.isConfirmed){
                        const id = fila.querySelector('#idProduct').textContent
                        const respuesta = await this.#servicioProducto.eliminarProducto(id, this.#adminPerfil.token)

                        if (respuesta.message === "Producto eliminado exitosamente") {
                            Swal.fire({
                                title: 'Producto eliminado',
                                text: "El producto ha sido eliminado exitosamente.",
                                icon: 'success',
                                confirmButtonColor: '#815F51',
                                background: '#F9F5F3', 
                                color: '#36241C',
                                iconColor: '#815F51'
                            }).then((result) => {
                                if (result.isConfirmed || result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.timer || result.dismiss === Swal.DismissReason.close || result.dismiss === Swal.DismissReason) {
                                    location.reload();
                                }
                            });  
                        } else {
                            Swal.fire({
                                title: 'Error al eliminar',
                                text: 'No se ha podido eliminar el producto. Intente de nuevo más tarde.',
                                icon: 'error',
                                iconColor: '#815F51',
                                confirmButtonColor: '#815F51',
                                background: '#F9F5F3', 
                                color: '#36241C'
                            });
                        }
                    }
                })
            })
        })
    }

    #despliegaProducto(table, tbody, producto) {
        let imageUrl = null;

        if (producto.imagenurl.includes('http')) {
            imageUrl = producto.imagenurl;
        } else {
            imageUrl = `../../img/${producto.imagenurl}`;
        }

        tbody.innerHTML +=
            `   
            <tr class="bg-brown-25 text-brown-300 font-roboto">
            <td id="idProduct" class="py-1 px-2 border-b hidden">${producto._id}</td>
            <td class="py-2 px-4 w-36 border-b">
                <img src="${imageUrl}" referrerpolicy="no-referrer" alt="${producto.nombre}"
                   class="object-cover rounded-lg">
            </td>
            <td id="name" class="py-2 px-4 border-b">${producto.nombre}</td>
            <td class="py-2 px-4 border-b">${producto.descripcion}</td>
            <td class="py-2 px-4 border-b">${producto.categoria}</td>
            <td class="py-2 px-4 border-b">$${producto.precio}</td>
            <td class="py-2 px-4 border-b">${producto.stock}</td>
            <td class="py-2 px-4 border-b">
                <a href="../../src/admin-update-product.html?id=${producto._id}">
                    <button id="btn-actualizar" class="bg-brown-100 font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg">Actualizar</button>
                </a>
            </td>
            <td class="py-2 px-4 border-b">
               <button class="bg-red-600 btnDelete font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-25 hover:bg-red-900 hover:text-white hover:drop-shadow-lg">Eliminar</button>
            </td>

            </tr>
            `
        table.appendChild(tbody);
    }
}