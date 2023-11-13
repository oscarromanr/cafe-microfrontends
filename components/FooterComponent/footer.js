export class Footer extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        const shadow = this.attachShadow({mode:"open"})
        this.#render(shadow);
    }

    async #render(shadow){
        await fetch('../components/FooterComponent/footer.html')
            .then(response => response.text())
            .then(html => {
                shadow.innerHTML += html;
            })
            .catch(error => console.error('error Loading HTML: ', error));
    }
}