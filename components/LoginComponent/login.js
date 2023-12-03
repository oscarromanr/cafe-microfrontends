import { ServicioUsuario } from "../../Servicio/usuarioServicio.js";
import { ServicioCookie } from "../../Servicio/cookieServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class Login extends HTMLElement {
    #servicio = new ServicioUsuario();
    #cookie = new ServicioCookie();

    constructor() {
        super();
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        await this.#checkCookie();
        this.#render(shadow);
    }

    async #render(shadow) {
        await fetch('../components/LoginComponent/login.html')
            .then(response => response.text())
            .then(html => {
                shadow.innerHTML += html;
            })
            .catch(error => console.error('Error loading HTML: ', error));
        this.#addEventListener(shadow);
    }

    #addEventListener(shadow) {
        const form = shadow.querySelector('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que el formulario se envíe automáticamente
            this.#login(shadow);
        });

        const togglePassword = shadow.getElementById('togglePassword');
        const password = shadow.getElementById('password');

        togglePassword.addEventListener('click', function () {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye-slash');
            this.querySelector('i').classList.toggle('fa-eye');
        });
    }

    async #login(shadow) {
        const email = shadow.querySelector('#email').value;
        const password = shadow.querySelector('#password').value;

        const respuesta = await this.#servicio.inicioSesion(email, password);

        if (email !== '' && password !== '') {
            // Para no revelar información de si el correo o la contraseña son incorrectos, se muestra el mismo mensaje para ambos casos

            if (respuesta === 'El correo electrónico no está registrado' || respuesta === 'Contraseña incorrecta') {
                Swal.fire({
                    title: 'Error',
                    text: 'Los datos son incorrectos. Vuelva a intentarlo.',
                    icon: 'error',
                    confirmButtonColor: '#815F51',
                    iconColor: '#815F51',
                    background: '#F9F5F3', 
                    color: '#36241C'
                });
            }
            if (typeof respuesta === 'object' && respuesta !== null) {
                window.location.href = `../../src/userpage.html`;
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Los campos no pueden estar vacíos.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3', 
                color: '#36241C'
            });
        }
    }

    async #checkCookie() {
        const usuarioCookie = this.#cookie.getCookie('usuario');

        if (usuarioCookie !== '' && usuarioCookie !== null) {
            const cookieDecoded = this.#cookie.decodeJwt(usuarioCookie); 
            const respuesta = await this.#servicio.obtenerUsuarioPorId(cookieDecoded.idUsuario);

            if (respuesta.message === 'No se logró obtener el usuario'){
                this.#cookie.deleteCookie('usuario');
            } else {
                window.location.href = `../../src/userpage.html`;
            }
        }
    }
}