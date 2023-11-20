import { ServicioUsuario } from "../../Servicio/usuarioServicio.js";

export class Registro extends HTMLElement {
    #servicio = new ServicioUsuario();
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        this.#render(shadow);
    }

    async #render(shadow) {
        await fetch('../components/RegistrarComponent/registro.html')
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
            this.#verifyData();
        });
    }

    async #verifyData() {
        const name = this.shadowRoot.querySelector('#name').value;
        const email = this.shadowRoot.querySelector('#email').value;
        const calle = this.shadowRoot.querySelector('#calle').value;
        const noCasa = this.shadowRoot.querySelector('#noCasa').value;
        const col = this.shadowRoot.querySelector('#col').value;
        const tel = this.shadowRoot.querySelector('#tel').value;
        const password = this.shadowRoot.querySelector('#password').value;
        const rol = 'Usuario'
        console.log(name, email, calle, noCasa, col, tel, password);
        if((name, email, calle, noCasa, col, tel, password) !== ''){
            if (this.validarEmail(email)){
                if (tel.length == 10){
                    const respuesta = await this.#servicio.crearUsuario(name, email, password, rol, calle, noCasa, col, tel);
                    console.log(respuesta);
                    if(respuesta.message === 'Usuario creado exitosamente'){
                        alert('Usuario creado exitosamente');
                        window.location.href = `../../src/Login.html`;
                    } else {
                        alert('Error al crear usuario');
                    }
                } else {
                    alert('El numero de telefono debe tener 10 digitos');
                }
            } else {
                alert('El email no es valido');
            }
        } else {
            alert('Faltan campos por llenar');
        } 
    }

    validarEmail(email){
        const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        const valido = emailRegex.test(email);
        if(!valido){
            return false
        }
        return true
    }
}