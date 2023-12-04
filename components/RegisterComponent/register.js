import { ServicioUsuario } from "../../Servicio/usuarioServicio.js";
import { ServicioCookie } from "../../Servicio/cookieServicio.js";
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class Register extends HTMLElement {
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
        await fetch('../components/RegisterComponent/register.html')
            .then(response => response.text())
            .then(html => {
                shadow.innerHTML += html;
            })
            .catch(error => console.error('Error loading HTML: ', error));
        this.#addEventListener(shadow);
    }

    #addEventListener(shadow) {
        const form = this.shadowRoot.querySelector('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que el formulario se envíe automáticamente
            this.#register(shadow);
        });

        const togglePassword = this.shadowRoot.getElementById('togglePassword');
        const password = this.shadowRoot.getElementById('password');

        togglePassword.addEventListener('click', function () {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye-slash');
            this.querySelector('i').classList.toggle('fa-eye');
        });

        const toggleConfirmPassword = this.shadowRoot.getElementById('toggleConfirmPassword');
        const confirmPassword = this.shadowRoot.getElementById('confirm-password');

        toggleConfirmPassword.addEventListener('click', function () {
            const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPassword.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye-slash');
            this.querySelector('i').classList.toggle('fa-eye');
        });
    }

    async #register(shadow) {
        const nombre = shadow.querySelector('#name').value;
        const email = shadow.querySelector('#email').value;
        const calle = shadow.querySelector('#calle').value;
        const numCasa = shadow.querySelector('#numero-casa').value;
        const colonia = shadow.querySelector('#colonia').value;
        const telefono = shadow.querySelector('#telefono').value;
        const password = shadow.querySelector('#password').value;
        const confirmPassword = shadow.querySelector('#confirm-password').value;

        if (
            nombre === '' ||
            email === '' ||
            calle === '' ||
            numCasa === '' ||
            colonia === '' ||
            telefono === '' ||
            password === '' ||
            confirmPassword === ''
        ) {
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
        }

        if (numCasa < 0 && telefono < 0) {
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
        }

        if (nombre.length > 50) {
            Swal.fire({
                title: 'Error',
                text: 'El campo "Nombre completo" es demasiado largo.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
            return;
        }

        if (email.length > 100) {
            Swal.fire({
                title: 'Error',
                text: 'El campo "Correo electrónico" es demasiado largo.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
            return;
        }

        if (calle.length > 100) {
            Swal.fire({
                title: 'Error',
                text: 'El campo "Calle" es demasiado largo.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
            return;
        }

        if (colonia.length > 100) {
            Swal.fire({
                title: 'Error',
                text: 'El campo "Colonia" es demasiado largo.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
            return;
        }

        if (telefono.length > 15) {
            Swal.fire({
                title: 'Error',
                text: 'El campo "Teléfono" es demasiado largo.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
            return;
        }

        if (telefono.length < 8) {
            Swal.fire({
                title: 'Error',
                text: 'El campo "Teléfono" es demasiado corto, debe tener al menos 8 dígitos.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
            return;
        }

        if (password.length > 50) {
            Swal.fire({
                title: 'Error',
                text: 'La contraseña es demasiado larga.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
            return;
        }

        if (numCasa.length > 10) {
            Swal.fire({
                title: 'Error',
                text: 'El campo "Número de casa" es demasiado largo.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden. Vuelva a intentarlo.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
            return;
        }

        const respuesta = await this.#servicio.crearUsuario(
            nombre,
            email,
            calle,
            numCasa,
            colonia,
            telefono,
            password
        );

        if (respuesta === 'El correo electrónico ya está registrado') {
            Swal.fire({
                title: 'Error',
                text: 'Ya existe una cuenta asociada al correo electrónico ingresado.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
        } else if (respuesta === 'No puede haber campos vacios' || respuesta === null) {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un error al registrar el usuario. Intente de nuevo.',
                icon: 'error',
                confirmButtonColor: '#815F51',
                iconColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C'
            });
        } else if (typeof respuesta === 'object' && respuesta !== null) {
            Swal.fire({
                title: 'Registro exitoso',
                text: "¡Bienvenido a la familia de Café Tatiaxca Obregón!, ahora puedes iniciar sesión.",
                icon: 'success',
                confirmButtonColor: '#815F51',
                background: '#F9F5F3',
                color: '#36241C',
                iconColor: '#815F51'
            }).then((result) => {
                if (
                    result.isConfirmed ||
                    result.dismiss === Swal.DismissReason.esc ||
                    result.dismiss === Swal.DismissReason.backdrop ||
                    result.dismiss === Swal.DismissReason.timer ||
                    result.dismiss === Swal.DismissReason.close ||
                    result.dismiss === Swal.DismissReason
                ) {
                    window.location.href = '../../src/login.html';
                }
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