export class Contact extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        const shadow = this.attachShadow({mode:"open"});
        this.#render(shadow);
    }

    async #render(shadow){
        await fetch('../components/ContactComponent/contact.html')
            .then(response => response.text())
            .then(html => {
                shadow.innerHTML += html;
            })
            .catch(error => console.error('Error loading HTML: ', error));
    }
}