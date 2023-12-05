import { ServicioProducto } from "../../Servicio/productoServicio.js";
import { ServicioAdministrador } from "../../Servicio/adminServicio.js";
import { ServicioCookie } from "../../Servicio/cookieServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";
import { ServicioImgur } from "../../Servicio/imgurServicio.js";

export class RegistrarProducto extends HTMLElement {
    #servicioProducto = new ServicioProducto();
    #servicioAdmin = new ServicioAdministrador();
    #servicioImgur = new ServicioImgur();
    #cookie = new ServicioCookie();
    #adminPerfil = null;

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
                            this.#initSubmit(shadow);
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

    #initSubmit(shadow) {
        let formAddProduct = shadow.querySelector('#formAddProduct');

        formAddProduct.addEventListener('submit', async (event) => {
            event.preventDefault();
            const nombreField = shadow.querySelector('#grid-nombre'); //type text
            const categoriaField = shadow.querySelector('#grid-categoria'); //type text
            const precioField = shadow.querySelector('#grid-precio'); //type number
            const stockField = shadow.querySelector('#grid-stock'); //type number
            const imagenField = shadow.querySelector('#grid-img'); //type file
            const descripcionField = shadow.querySelector('#grid-descripcion'); //type text
            const imagen = imagenField.files[0];
            let imagenurl = null;

            if (nombreField.value == '' || categoriaField.value == '' || precioField.value == '' || stockField.value == '' || imagenField.value == '' || descripcionField.value == '') {
                Swal.fire({
                    title: 'Error',
                    text: 'Los campos no pueden estar vacíos.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3', 
                    color: '#36241C'
                });
                return;
            } else if (isNaN(precioField.value) || isNaN(stockField.value)) {
                Swal.fire({
                    title: 'Error',
                    text: 'Los campos precio y stock deben ser números.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3',
                    color: '#36241C'
                });
                return;
            } else if (stockField.value < 0 || precioField.value < 0) {
                Swal.fire({
                    title: 'Error',
                    text: 'Los valores numéricos no pueden ser negativos.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3',
                    color: '#36241C'
                });
                return;
            } else if (precioField.value.length > 10) {
                Swal.fire({
                    title: 'Error',
                    text: 'El precio no puede tener más de 10 dígitos.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3', 
                    color: '#36241C'
                });
                return;
            } else if (stockField.value.length > 5) {
                Swal.fire({
                    title: 'Error',
                    text: 'El stock no puede tener más de 10 dígitos.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3', 
                    color: '#36241C'
                });
                return;
            } else if (imagenField.files.length === 0) {
                Swal.fire({
                    title: 'Error',
                    text: 'Debe seleccionar una imagen.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3',
                    color: '#36241C'
                });
                return;
            } else if (nombreField.value.length > 50){
                Swal.fire({
                    title: 'Error',
                    text: 'El nombre no puede tener más de 50 caracteres.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3',
                    color: '#36241C'
                });
                return;
            } else if (categoriaField.value.length > 100){
                Swal.fire({
                    title: 'Error',
                    text: 'La categoría no puede tener más de 100 caracteres.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3',
                    color: '#36241C'
                });
                return;
            } else if (descripcionField.value.length > 1000){
                Swal.fire({
                    title: 'Error',
                    text: 'La descripción no puede tener más de 1000 caracteres.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3',
                    color: '#36241C'
                });
                return;
            }

            if (imagenField.files[0].type !== 'image/jpeg' && imagenField.files[0].type !== 'image/png') {
                Swal.fire({
                    title: 'Error',
                    text: 'La imagen debe ser de tipo jpg, jpeg o png.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3',
                    color: '#36241C'
                });
                return;
            }

            if (imagenField.files[0].size > 5000000) {
                Swal.fire({
                    title: 'Error',
                    text: 'La imagen no puede pesar más de 5MB.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3',
                    color: '#36241C'
                });
                return;
            }

            try {
                const formData = new FormData();
                formData.append('image', imagen);

                Swal.fire({
                    title: 'Guardando producto...',
                    text: 'Por favor, espere...',
                    icon: 'info',
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    background: '#F9F5F3',
                    iconColor: '#815F51',
                    color: '#36241C',
                    onBeforeOpen: () => {
                        Swal.showLoading();
                    }
                });

                await this.#servicioImgur.subirImagen(imagen)
                    .then(async data => {
                        imagenurl = data.data.link;

                        if (data.status === 200) {
                            const respuesta = await this.#servicioProducto.crearProducto(nombreField.value, descripcionField.value, precioField.value, stockField.value, categoriaField.value, imagenurl, this.#adminPerfil.token);

                            if (typeof respuesta === 'object' && respuesta !== null) {
                                const producto = respuesta.producto;
                                Swal.fire({
                                    title: '¡Producto creado!',
                                    text: 'El producto se ha creado exitosamente.',
                                    icon: 'success',
                                    confirmButtonColor: '#815F51',
                                    iconColor: '#815F51',
                                    background: '#F9F5F3',
                                    color: '#36241C'
                                }).then((result) => {
                                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop || result.dismiss === Swal.DismissReason.timer || result.dismiss === Swal.DismissReason.close || result.dismiss === Swal.DismissReason) {
                                        window.location.href = '../../src/admin-products.html';
                                    }
                                });
                            } else {
                                throw new Error('No se pudo crear el producto');
                            }
                        } else {
                            throw new Error('No se pudo subir la imagen');
                        }
                    });
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al crear el producto. Vuelva a intentarlo más tarde',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3',
                    color: '#36241C'
                });
                return;
            }
        });
    }

    #render(shadow) {
        shadow.innerHTML = `
        <link rel="stylesheet" href="../../components/RegistrarProductoComponent/css/registrarProducto.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
        
        <section class="bg-brown-50">
            <div class="container flex flex-col items-center justify-between max-w-screen-xl p-12 mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-center max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                <div class="flex flex-col justify-between md:mb-0 md:w-fit">
                    <div class="w-full mx-auto">
                        <h1 class="p-8 mt-4 mb-4 md:mt-8 md:mb-8 text-4xl font-medium text-center text-brown-100 md:text-5xl font-helvetica">Agregar nuevo producto</h1>
                    </div>
                </div>
            </div>    
        </section>
        
        <section class="flex flex-col items-center justify-center w-full pt-8 bg-brown-400">
            <div class="p-8">
                <form class="w-full max-w-3xl" method="POST" enctype="text/plain" id="formAddProduct">
                    <div class="flex flex-wrap mb-6">
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="grid-nombre">
                                Nombre *
                            </label>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-nombre" type="text" maxlength=100 placeholder="Café organico" required>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="grid-categoria">
                                Categoría *
                            </label>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-categoria" type="text" maxlength=50 placeholder="Café en grano" required>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="grid-precio">
                                Precio *
                            </label>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-precio" type="number" maxlength=10 placeholder="Cantidad" required>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="grid-stock">
                                Stock *
                            </label>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-stock" type="number" maxlength=5 placeholder="Cantidad disponible" required>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3" id="drop-area">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="grid-img">
                                Imagen *
                            </label>
                            <button id="fileInputBtn" class="px-4 py-2 font-bold transition duration-200 rounded shadow bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white focus:shadow-outline focus:outline-none">
                                Seleccionar archivo
                            </button>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-img" type="file" placeholder="Arrastre y suelte un archivo" required>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="grid-descripcion">
                                Descripción *
                            </label>
                            <textarea class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" maxlength=1000 id="grid-descripcion" required></textarea>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3 md:w-1/3">
                            <button id="addProduct" class="px-4 py-2 font-bold transition duration-200 rounded shadow bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white focus:shadow-outline focus:outline-none" type="submit">
                            <i class="fa fa-plus mr-2"></i>Agregar producto
                            </button>
                        </div>
                    </div>
                    </div>
                    
                </form>
            </div>
        </section>
        `
    }
}