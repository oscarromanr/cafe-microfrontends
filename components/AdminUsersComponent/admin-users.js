import { ServicioUsuario } from "../../Servicio/usuarioServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class AdminUsers extends HTMLElement {
    #servicio = new ServicioUsuario();
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', () => {
            this.#render(shadow);
            this.#consultaUsuarios(shadow);
        });
    }

    #render(shadow) {
        shadow.innerHTML = `
        <link rel="stylesheet" href="../../components/AdminProducts/css/adminProducts.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
        
        <section class="bg-brown-50">
            <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="w-full mb-6">
                        <h1 class="text-brown-100 text-4xl md:text-5xl mt-8 p-8 text-center font-medium font-helvetica">Lista de usuarios</h1>
                    </div>
            </div>       

            <div class="z-10 p-8  w-full bg-brown-400">
                <div class="overflow-x-auto">
                    <table class="p-8 bg-brown-50 w-full max-w-6xl md:p-6 mx-auto table-auto rounded text-lg mb-16" id="tabla">
                        <thead>
                            <tr>
                                <th class="py-2 px-2 text-left border-b bg-brown-100 text-brown-50">ID</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Nombre</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Correo electrónico</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Calle</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Número de casa</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Colonia</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Teléfono</th>
                                <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Eliminar</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </section>

        `
    }

    #consultaUsuarios(shadow) {
        this.#servicio.obtenerUsuarios()
            .then(users => {
                let table = shadow.querySelector('#tabla');
                let tbody = document.createElement('tbody');
                const usuarios = users;
                usuarios.forEach(element => {
                    this.#despliegaUsuario(table, tbody, element);
                });
            }).then(() => {
                this.#eliminarUsuario()
            })
    }

    #eliminarUsuario(){
        const btnEliminar = this.shadowRoot.querySelectorAll('.bg-red-600');
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
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar',
                    background: '#F9F5F3',
                    iconColor: '#815F51',
                    color: '#36241C'
                }).then((result) => {
                    if(result.isConfirmed){
                        const id = fila.querySelector('#idUser').textContent
                        this.#servicio.eliminarUsuario(id)
                        Swal.fire({
                            title: 'Usuario eliminado',
                            text: "El usuario se elimino exitosamente",
                            icon: 'success',
                            confirmButtonColor: '#815F51',
                            background: '#F9F5F3', 
                            iconColor: '#815F51',
                            color: '#36241C',
                            showCancelButton: true,
                            cancelButtonText: 'Cerrar',
                            cancelButtonColor: '#E53E3E',
                            confirmButtonText: 'Volver al menu',
                            confirmButtonAriaLabel: 'Volver a la lista de usuarios'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = 'admin-index.html';
                            }
                        })
                    }
                })
            })
        })
    }

    #despliegaUsuario(table, tbody, usuario) {
        tbody.innerHTML +=
            `   
            <tr class="bg-brown-25 text-brown-300 font-roboto">
            <td id="idUser" class="py-2 px-2 border-b">${usuario._id}</td>
            <td class="py-2 px-4 border-b">${usuario.nombre}</td>
            <td class="py-2 px-4 border-b">${usuario.email}</td>
            <td class="py-2 px-4 border-b">${usuario.calle}</td>
            <td class="py-2 px-4 border-b">${usuario.numerocasa}</td>
            <td class="py-2 px-4 border-b">${usuario.colonia}</td>
            <td class="py-2 px-4 border-b">${usuario.telefono}</td>
            <td class="py-2 px-4 border-b">
               <button class="bg-red-600 font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-25 hover:bg-red-900 hover:text-white hover:drop-shadow-lg">Eliminar</button>
            </td>

            </tr>
            `
        table.appendChild(tbody);
    }
}