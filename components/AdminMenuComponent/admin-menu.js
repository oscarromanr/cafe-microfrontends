import { ServicioAdministrador } from "../../Servicio/adminServicio.js";
import { ServicioCookie } from "../../Servicio/cookieServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class AdminMenu extends HTMLElement {
    #servicio = new ServicioAdministrador();
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
                            this.#render(shadow, this.#adminPerfil);
                            this.#setupAccountActions(shadow, this.#adminPerfil, admin.token);
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
        return this.#servicio.obtenerAdminPorId(idAdmin);
    }

    #render(shadow, admin){
        shadow.innerHTML = `
        <link rel="stylesheet" href="../../components/AdminMenuComponent/css/admin-menu.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

        <section class="bg-brown-50">
            <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                <div class="flex flex-col justify-between mx-auto mb-2 md:mb-0 md:w-fit pb-16">
                    <div class="w-full mx-auto">
                        <h1 class="text-brown-100 text-2xl md:text-4xl mx-auto mt-8 p-8 text-center font-medium font-helvetica">Bienvenido ${admin.nombre}</h1>
                        <p class="text-brown-300 text-center font-roboto mx-auto text-lg md:text-xl px-8 md:px-20">En esta página puedes realizar acciones con tu cuenta y editar tu información personal.</p>
                    </div>
                </div>
            </div>   

            <div class="z-10 p-8 w-full bg-brown-400">
                <div class="mx-auto mb-4 pt-6 p-4 max-w-3xl">
                    <h2 class="text-brown-200 text-center text-2xl md:text-3xl font-medium">Acciones de cuenta</h2>
                </div>
                <div class="flex flex-col mb-4 max-w-lg mx-auto p-2 pt-6 pb-6 md:pt-2 md:pb-48">
                    <button id="btnLogout" type="button" class="w-full transition duration-150 mr-2 mb-4 p-2 bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-l rounded">
                        <i class="fas fa-right-from-bracket mr-2"></i>Cerrar sesión
                    </button>
                </div>
            </div>
        </section>
        `;
    }

    #setupAccountActions(shadow){

        const btnLogout = shadow.querySelector('#btnLogout');

        btnLogout.addEventListener('click', () => {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir el cierre de sesión una vez confirmado.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#815F51',
                cancelButtonColor: '#E53E3E',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar',
                background: '#F9F5F3', 
                color: '#36241C',
                iconColor: '#815F51'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.#cookie.deleteCookie('admin');
                    window.location.href = '../../src/index.html';
                }
            });
        });

    }

    #getCookie() {
        return this.#cookie.getCookie('admin');
    }
}