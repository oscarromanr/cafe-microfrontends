import { ServicioProducto } from "../../Servicio/productoServicio.js";
import { ServicioUsuario } from "../../Servicio/usuarioServicio.js";
import { ServicioCookie } from "../../Servicio/cookieServicio.js";
import { ServicioOrden } from "../../Servicio/ordenServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class OrderList extends HTMLElement {
    #servicioProducto = new ServicioProducto();
    #servicioOrden = new ServicioOrden();
    #servicioUsuario = new ServicioUsuario();
    #cookie = new ServicioCookie();
    #usuarioPerfil = null;
    #cantidadOrdenes = null;

    constructor(){
        super();
    }

    connectedCallback(){
        const shadow = this.attachShadow({mode: "open"});

        document.addEventListener('DOMContentLoaded', () => {
            const cookieUser = this.#getCookie();
                if (cookieUser) {
                    const cookieDecoded = this.#cookie.decodeJwt(cookieUser); // Decodifica la cookie con JWT

                    const usuarioId = cookieDecoded.idUsuario; //obtiene el id del usuario desde el token, agregar en los otros componentes
                    this.#fetchUser(usuarioId)
                        .then(usuario => {
                            if (usuario && usuario.message !== 'No se logró obtener el usuario') {
                                usuario.token = JSON.parse(cookieUser).token;
                                this.#usuarioPerfil = usuario;
                                this.#render(shadow, this.#usuarioPerfil);
                                this.#consultaOrdenes(shadow, this.#usuarioPerfil);
                            } else {
                                window.location.href = `../../src/login.html`;
                            }
                        });
                } else {
                    window.location.href = '../../src/login.html';
                }
            });
    }

    #fetchUser(idUsuario){
        return this.#servicioUsuario.obtenerUsuarioPorId(idUsuario);
    }

    #getCookie() {
        return this.#cookie.getCookie('usuario');
    }

    #render(shadow, user){
        shadow.innerHTML = `
            <link rel="stylesheet" href="../../components/OrdersComponent/css/orders.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
            
            <section class="bg-brown-50">
                <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                </div>   
                <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                        <div class="w-full mb-6">
                            <h1 class="text-brown-100 text-4xl md:text-5xl mt-8 p-8 text-center font-medium font-helvetica">Lista de ordenes</h1>
                        </div>
                </div>       

                <div class="z-10 p-8 w-full md:pb-72 pb-32 bg-brown-400" id="tableDiv">
                    <div class="mt-6 rounded-lg border bg-brown-25 w-full max-w-6xl mx-auto p-8 shadow-md md:mt-0 hidden" id="avisoOrders">
                        <p class="text-brown-100 font-helvetica md:text-2xl text-xl">
                            Actualmente no tienes ordenes registradas.
                        </p>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="p-8 bg-brown-50 mb-4 w-full max-w-6xl md:p-6 mx-auto table-auto rounded text-lg" id="tabla">
                            <thead>
                                <tr>
                                    <th class="py-1 px-2 text-left border-b bg-brown-100 text-brown-50 hidden">ID Orden</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50 hidden">ID Usuario</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Fecha Orden</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Estado</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Total</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50"># Productos</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Direccion envio</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Metodo pago</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Ver orden</th>
                                    <th class="py-2 px-4 text-left border-b bg-brown-100 text-brown-50">Eliminar orden</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    <div class="mt-6 items-center mb-4 w-full max-w-6xl mx-auto">
                        <a class="bg-brown-100 font-medium text-lg font-helvetica p-4 transition-all rounded scroll-smooth md:mr-4 text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg" href="../../src/catalogo.html"><i class="fa fa-shopping-cart mr-2"></i> Ir a comprar</a>
                    </div>
                </div>
            </section>
        `
    }

    #consultaOrdenes(shadow, user) {        
        this.#servicioOrden.obtenerOrdenesPorUsuario(user._id, user.token)
            .then(orders => {
                let table = shadow.querySelector('#tabla');
                let tbody = document.createElement('tbody');
                const ordenes = orders.ordenes;
                this.#cantidadOrdenes = ordenes.length;
                ordenes.forEach(element => {
                    this.#despliegaOrden(table, tbody, element);
                });
            }).then(() => {
                this.#initButtons(shadow);

                if (this.#cantidadOrdenes <= 0) {
                    const table = shadow.querySelector('#tabla');
                    const aviso = shadow.querySelector('#avisoOrders');
                    aviso.classList.remove('hidden');
                    table.classList.add('hidden');
                } 

                if (this.#cantidadOrdenes > 3) {
                    const tableDiv = shadow.querySelector('#tableDiv');
                    tableDiv.classList.remove('md:pb-72');
                    tableDiv.classList.remove('pb-32');
                    tableDiv.classList.add('pb-16');
                }
            })
    }

    #initButtons(shadow) {
        const btnEliminar = shadow.querySelectorAll('.btnDelete');

        btnEliminar.forEach((boton) => {
            boton.addEventListener('click', () => {
                const fila = boton.closest('tr');
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: "¿Deseas eliminar esta orden?",
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
                        const id = fila.querySelector('#idOrder').textContent
                        const respuesta = await this.#servicioOrden.eliminarOrden(id, this.#usuarioPerfil.token)

                        if (respuesta.message === "Orden eliminada exitosamente") {
                            Swal.fire({
                                title: 'Orden eliminada',
                                text: "La orden ha sido eliminado exitosamente.",
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
                                text: 'No se ha podido eliminar la orden. Intente de nuevo más tarde.',
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

    #despliegaOrden(table, tbody, orden){

        tbody.innerHTML +=
            `   
            <tr class="bg-brown-25 text-brown-300 font-roboto">
            <td id="idOrder" class="py-1 px-2 border-b hidden">${orden._id}</td>
            <td id="idUser" class="py-2 px-4 border-b hidden">${orden.idUsuario}</td>
            <td class="py-2 px-4 border-b">${orden.fechaOrden}</td>
            <td class="py-2 px-4 border-b">${orden.estado}</td>
            <td class="py-2 px-4 border-b">$${orden.total.toFixed(2)}</td>
            <td class="py-2 px-4 border-b">${orden.productos.length}</td>
            <td class="py-2 px-4 border-b">${orden.direccionEnvio}</td>
            <td class="py-2 px-4 border-b">${orden.metodoPago}</td>
            <td class="py-2 px-4 border-b">
                <a href="order-detail.html?id=${orden._id}">
                <button class="bg-brown-100 btnView font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-lg"> Ver </button>
                </a>
            </td>
            <td class="py-2 px-4 border-b">
               <button id="btn-eliminar" class="bg-red-600 btnDelete font-medium font-helvetica p-2 transition-all rounded scroll-smooth text-brown-25 hover:bg-red-900 hover:text-white hover:drop-shadow-lg">Eliminar</button>
            </td>
            </tr>
            `
        table.appendChild(tbody);
    }
}