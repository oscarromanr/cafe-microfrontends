

export class Producto extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        const shadow = this.attachShadow({mode:'open'});
        this.#render(shadow);
    }

    async #render(){
        await fetch('../components/ProductoComponent/producto.html')
            .then(response => response.text())
            .then(html => {
                shadow.innerHTML += html;
            })
            .catch(error => console.error('Error loading HTML: ', error));
    }
}