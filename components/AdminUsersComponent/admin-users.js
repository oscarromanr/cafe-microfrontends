import { ServicioUsuario } from "../../Servicio/usuarioServicio.js";
import { ServicioAdministrador } from "../../Servicio/adminServicio.js";
import { ServicioCookie } from "../../Servicio/cookieServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class AdminUsers extends HTMLElement {
    #servicioUsuario = new ServicioUsuario();
    #servicioAdmin = new ServicioAdministrador();
    #cookie = new ServicioCookie();
    #adminPerfil = null;
    #cantidadUsuarios = null;

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
                            this.#consultaUsuarios(shadow);
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
        <link rel="stylesheet" href="../../components/AdminUsersComponent/css/admin-users.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
        
        <section class="bg-brown-50">
            <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="w-full mb-6">
                        <h1 class="text-brown-100 text-4xl md:text-5xl mt-8 p-8 text-center font-medium font-helvetica">Lista de usuarios</h1>
                    </div>
            </div>       
            
            <div class="z-10 p-8 w-full md:pb-72 bg-brown-400" id="tableDiv">
                <div class="mt-6 rounded-lg border bg-brown-25 w-full max-w-6xl mx-auto p-8 shadow-md md:mt-0 hidden" id="avisoUsers">
                    <p class="text-brown-100 font-helvetica md:text-2xl text-xl">
                        Actualmente no existen usuarios registrados.
                    </p>
                    <a href="../../src/admin-index.html"><button class="mt-6 w-full px-8 md:px-4 md:w-fit rounded-md bg-brown-100 py-1.5 font-medium text-brown-25 transition-all duration-150 hover:text-white hover:bg-brown-300">Volver al menú</button></a>
                </div>
                <div class="overflow-x-auto">
                    <table class="p-8 bg-brown-50 w-full max-w-6xl md:p-6 mx-auto table-auto rounded text-lg mb-16" id="tabla">
                        <thead>
                            <tr>
                                <th class="py-2 px-2 text-left border-b bg-brown-100 text-brown-50 hidden">ID</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Nombre</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Correo electrónico</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Calle</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Núm. casa</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Colonia</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Teléfono</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Eliminar</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </section>

        `;
    }

    #consultaUsuarios(shadow) {
        this.#servicioUsuario.obtenerUsuarios()
            .then(users => {
                let table = shadow.querySelector('#tabla');
                let tbody = document.createElement('tbody');
                const usuarios = users;
                this.#cantidadUsuarios = usuarios.length;
                usuarios.forEach(element => {
                    this.#despliegaUsuario(table, tbody, element);
                });
            }).then(() => {
                this.#initDeleteButtons()

                if (this.#cantidadUsuarios <= 0) {
                    const table = shadow.querySelector('#tabla');
                    const aviso = shadow.querySelector('#avisoUsers');
                    aviso.classList.remove('hidden');
                    table.classList.add('hidden');
                } 

                if (this.#cantidadUsuarios > 3) {
                    const tableDiv = shadow.querySelector('#tableDiv');
                    tableDiv.classList.remove('md:pb-72');
                }
            })
    }

    #initDeleteButtons(){
        const btnEliminar = this.shadowRoot.querySelectorAll('.btnDelete');
        btnEliminar.forEach((boton) => {
            boton.addEventListener('click', () => {
                const fila = boton.closest('tr');
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¿Deseas eliminar este usuario?",
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
                        const id = fila.querySelector('#idUser').textContent;
                        const respuesta = await this.#servicioUsuario.eliminarUsuario(id, this.#adminPerfil.token);

                        if (respuesta.message === "Usuario eliminado exitosamente") {

                            Swal.fire({
                                title: 'Usuario eliminado',
                                text: "El usuario ha sido eliminado exitosamente.",
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
                                text: 'No se ha podido eliminar el usuario. Intente de nuevo más tarde.',
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

    #despliegaUsuario(table, tbody, usuario) {
        tbody.innerHTML +=
            `   
            <tr class="bg-brown-25 text-brown-300 font-roboto">
            <td id="idUser" class="py-2 px-2 border-b hidden">${usuario._id}</td>
            <td class="py-2 px-4 border-b">${usuario.nombre}</td>
            <td class="py-2 px-4 border-b">${usuario.email}</td>
            <td class="py-2 px-4 border-b">${usuario.calle}</td>
            <td class="py-2 px-4 border-b">${usuario.numerocasa}</td>
            <td class="py-2 px-4 border-b">${usuario.colonia}</td>
            <td class="py-2 px-4 border-b">${usuario.telefono}</td>
            <td class="py-2 px-4 border-b">
               <button class="bg-red-600 btnDelete font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-25 hover:bg-red-900 hover:text-white hover:drop-shadow-lg">Eliminar</button>
            </td>

            </tr>
            `
        table.appendChild(tbody);
    }
}