import { ServicioUsuario } from "../../Servicio/usuarioServicio.js";

export class Login extends HTMLElement {
    #servicio = new ServicioUsuario();
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.#render(shadow);
    }

    async #render(shadow) {
        await fetch('../components/LoginComponent/login.html')
            .then(response => response.text())
            .then(html => {
                shadow.innerHTML += html;
            })
            .catch(error => console.error('error Loading HTML: ', error));
        this.#addEventListener();
    }

    #addEventListener() {
        const form = this.shadowRoot.querySelector('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Evita que el formulario se envíe automáticamente
            this.#verifyUser();
        });
    }

    async #verifyUser() {
        const name = this.shadowRoot.querySelector('#name').value;
        const password = this.shadowRoot.querySelector('#password').value;
        console.log(name);
        const respuesta = await this.#servicio.verificarUsuario(name, password);
        console.log(respuesta)
        if (name !== '' && password !== '') {
            if (respuesta === 'La contraseña no coincide') {
                alert('La contraseña no coincide');
            }
            if (respuesta === 'El nombre de usuario no existe') {
                alert('El nombre de usuario no existe');
            }
            if (typeof respuesta === 'object' && respuesta !== null) {
                alert('Bienvenido');
                this.#servicio.inicioSesion(respuesta.id);
                window.location.href = `../../src/index.html`;
            }
        } else {
            alert('Faltan campos por llenar');
        }
    }
}