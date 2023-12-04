

export class OrdenDetail extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        document.addEventListener('DOMContentLoaded', () => {
            this.#render(shadow);
        })
    }

    #render(shadow) {
        shadow.innerHTML = `
        <style>
        /* Chrome, Safari, Edge, Opera */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
        }

        /* Firefox */
        input[type=number] {
        -moz-appearance: textfield;
        }
        </style>
        
        <link rel="stylesheet" href="../../components/OrdenComponent/css/orden-detail.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

        <section class="bg-brown-50">
            <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="w-full mb-6">
                        <h1 class="text-brown-100 text-4xl md:text-5xl mt-6 p-8 text-center font-medium font-helvetica">Carrito de compra</h1>
                    </div>
            </div>       
        
            <div class="mx-auto bg-brown-400 w-full pb-72" id="cartDiv">
                <div class="bg-brown-400 pt-8 md:max-w-7xl mx-auto">
                    <div class="mx-auto max-w-6xl justify-center px-6 md:flex md:space-x-6 xl:px-0 pb-8">
                    <div class="rounded-lg md:w-2/3">
                        ${products.length > 0 ? products.map(product => this.#renderOrders(product)).join('') :
                `<div class="mt-6 rounded-lg border bg-brown-25 p-8 shadow-md md:mt-0">
                                <p class="text-brown-100 font-helvetica md:text-2xl text-xl">
                                    Actualmente no cuentas con productos en el carrito.
                                </p>
                                <a href="catalogo.html"><button class="mt-6 w-full px-8 md:px-4 md:w-fit rounded-md bg-brown-100 py-1.5 font-medium text-brown-25 transition-all duration-150 hover:text-white hover:bg-brown-300"><i class="fas fa-shopping-cart mr-2 text-white"></i>Ir al catálogo</button></a>
                            </div>
                            `
            }
                        
                    </div>

                    <!-- Sub total -->
                    <div class="mt-6 h-full rounded-lg border bg-brown-25 p-6 shadow-md md:mt-0 md:w-1/3">
                        ${products.length > 0 ? this.#renderOrderDetail(products) : this.#renderOrderDetail()}
                    </div>
                </div>
            </div>
        </section>
        `
    }

    #renderOrders() {
        return `
        <div class="justify-between mb-6 rounded-lg bg-brown-25 p-6 shadow-md sm:flex sm:justify-start">
        <div class="sm:w-36 md:mr-2 w-full hover:scale-110 transition-all duration-200">
            <a href="product-detail.html?id=">
                <img src="../../img/" alt="product-image" class="rounded-lg"/>
            </a>
        </div>    
        
        <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
            <div class="mt-5 sm:mt-0 text-brown-300">
                <h2 class="text-lg md:text-xl font-bold "></h2>
                <p class="mt-1 text-md md:text-md"></p>
                <p class="mt-1 text-md md:text-md">Stock: </p>
                <p class="mt-4 text-md md:text-md"><strong>Precio:</strong> $ MXN</p>
                <p class="mt-1 text-md md:text-md"><strong>Total:</strong> $ MXN</p>
            </div>
            <div class="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                <div class="flex items-center border-gray-100">
                    <span class="cursor-pointer rounded-l bg-brown-100 py-1 px-3.5 duration-100 hover:bg-brown-300 btnMinus text-white"><i class="text-sm fas fa-minus"></i></span>
                    <input class="h-8 w-12 border bg-white text-center text-md outline-none" disabled type="number" value="" min="1" />
                    <span class="cursor-pointer rounded-r bg-brown-100 py-1 px-3 duration-100 hover:bg-brown-300 btnPlus text-white"><i class="text-sm fas fa-plus"></i></span>
                    <span class="ml-4 cursor-pointer rounded bg-brown-100 py-1 px-3 duration-100 hover:bg-brown-300 btnDelete text-white"><i class="fas fa-trash-alt"></i></span>
                </div>
            </div>
        </div>
    </div>
        `
    }

    #renderOrderDetail() {
        return `
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">Total</p>
            <p class="text-brown-300 text-md md:text-lg">$ MXN</p>
        </div>
        <div class="flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">Metodo pago</p>
            <p class="text-brown-300 text-md md:text-lg"> Transferencia </p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">Direccion envio</p>
            <p class="text-brown-300 text-md md:text-lg"> --- </p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">Estado envio</p>
            <p class="text-brown-300 text-md md:text-lg"> --- </p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">Fecha orden</p>
            <p class="text-brown-300 text-md md:text-lg"> --- </p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">Fecha orden</p>
            <p class="text-brown-300 text-md md:text-lg"> --- </p>
        </div>
        <div class="mb-2 flex justify-between">
            <p class="text-brown-300 text-md md:text-lg">Usuario</p>
            <p class="text-brown-300 text-md md:text-lg"> --- </p>
        </div>
        `
    }
}