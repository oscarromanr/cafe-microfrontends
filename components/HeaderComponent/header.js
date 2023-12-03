import { LocalStorageService } from "../../Servicio/LocalStorageService.js";

export class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const cart = JSON.parse(LocalStorageService.getItem('carrito')) || [];
        this.cantidadCarrito = cart.length;
        this.#render(shadow);
        this.#addToggleFunctionality(shadow);
    }

    #render(shadow) {
        shadow.innerHTML = `
            <link rel="stylesheet" href="../../components/HeaderComponent/css/header.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

            <div class="fixed z-10 w-full shadow-xl bg-brown-100">
                <nav class="container flex items-center justify-between max-w-screen-xl py-2 md:py-4 mx-auto">
                    <a href="../../src/index.html" class="flex items-center ml-6 space-x-3 cursor-pointer rtl:space-x-reverse">
                        <img src="../../img/logoTatiaxcaNew.svg" class="h-14 hidden md:block flex-shrink-0" alt="Logo" id="logo">
                        <img src="../../img/logoTatiaxcaMini.svg" class="h-14 md:hidden" alt="Logo" id="logoMini">
                    </a>
                    <div class="items-center hidden md:flex">
                        <a href="../../src/index.html"
                            class="px-5 py-2 text-xl font-semibold transition duration-200 rounded-md lg:px-8 group text-brown-50 hover:text-white">
                            Inicio
                            <span
                                class="rounded-lg block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-brown-50"></span>
                        </a>
                        <a href="../../src/index.html#about-us"
                            class="px-5 py-2 text-xl font-semibold transition duration-200 rounded-md lg:px-8 group text-brown-50 hover:text-white">
                            Nosotros
                            <span
                                class="rounded-lg block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-brown-50"></span>
                        </a>
                        <a href="../../src/catalogo.html"
                            class="px-5 py-2 text-xl font-semibold transition duration-200 rounded-md lg:px-8 group text-brown-50 hover:text-white">
                            Catálogo
                            <span
                                class="rounded-lg block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-brown-50"></span>
                        </a>
                        <a href="../../src/contact.html"
                            class="px-5 py-2 text-xl font-semibold transition duration-200 rounded-md lg:px-8 group text-brown-50 hover:text-white">
                            Contacto
                            <span
                                class="rounded-lg block max-w-0 group-hover:max-w-full transition-all duration-200 h-0.5 bg-brown-50"></span>
                        </a>
                        <hr class="my-2 border-brown-300">
                    </div>
                    
                    <div class="justify-end hidden mr-6 md:flex">
                        <a class="relative px-4 text-xl transition-all duration-200 hover:scale-110 text-brown-50 hover:text-white" href="../../src/cart.html">
                            <i class="fa fa-fw fa-shopping-cart"></i>
                            ${ this.cantidadCarrito > 0 ? ` 
                                <div class="absolute inline-flex items-center justify-center w-6 h-6 text-center text-xs font-helvetica font-bold text-brown-25 bg-brown-200 rounded-full -translate-x-3 -translate-y-3">
                                    ${this.cantidadCarrito}
                                </div>
                            ` : ''
                        }
                        </a>
                        <a class="relative px-4 text-xl transition-all duration-200 hover:scale-110 text-brown-50 hover:text-white" href="">
                            <i class="fa fa-fw fa-shopping-bag"></i>
                        </a>
                        <a class="relative px-4 text-xl transition-all duration-200 hover:scale-110 text-brown-50 hover:text-white" href="../../src/login.html">
                            <i class="fa fa-fw fa-user"></i>
                        </a>
                    </div>
                    
                    <div class="md:hidden">
                        <button id="toggleBtn" class="p-2 mr-4 rounded-md text-3xl bg-brown-100 text-brown-50 transition-all duration-150 focus:outline-4 hover:text-white outline outline-0 outline-brown-25">
                            <i class="fa fa-fw fa-bars"></i>
                        </button>
                        <div id="mobileMenu" class="hidden absolute top-14 right-0 mt-2 py-2 w-72 bg-brown-200 rounded-md shadow-lg">
                            <a href="../../src/index.html"
                                class="block px-4 py-2 text-sm text-brown-25 hover:bg-brown-300 hover:text-white transition-all duration-150">Inicio</a>
                            <a href="../../src/index.html#about-us"
                                class="block px-4 py-2 text-sm text-brown-25 hover:bg-brown-300 hover:text-white transition-all duration-150">Nosotros</a>
                            <a href="../../src/catalogo.html"
                                class="block px-4 py-2 text-sm text-brown-25 hover:bg-brown-300 hover:text-white transition-all duration-150">Catálogo</a>
                            <a href="../../src/contact.html"
                                class="block px-4 py-2 text-sm text-brown-25 hover:bg-brown-300 hover:text-white transition-all duration-150">Contacto</a>
                            <hr class="my-2 border-brown-25 mx-4">

                            <div class="flex items-center px-4 py-2 w-full">
                                <a href="../../src/cart.html"
                                    class="text-sm text-brown-25 hover:scale-110 hover:text-white transition-all duration-150 px-2">
                                    <i class="fa fa-fw fa-shopping-cart"></i>
                                        ${ this.cantidadCarrito > 0 ?
                                             ` 
                                                <div class="inline-flex items-center justify-center w-5 h-5 text-center text-xs font-helvetica font-bold text-brown-25 bg-brown-100 rounded-full -translate-x-3 -translate-y-3">
                                                    ${this.cantidadCarrito}
                                                </div>
                                             ` : ''
                                         }
                                </a>
                                <a href="../../src/index.html"
                                    class="text-sm text-brown-25 hover:scale-110 hover:text-white transition-all duration-150 px-2">
                                    <i class="fa fa-fw fa-shopping-bag"></i>
                                </a>
                                <a href="../../src/login.html"
                                    class="text-sm text-brown-25 hover:scale-110 hover:text-white transition-all duration-150 px-2">
                                    <i class="fa fa-fw fa-user"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        `;

        const logo = shadow.getElementById('logo');
        const logoMini = shadow.getElementById('logoMini');

        const mediaQuery = window.matchMedia('(max-width: 860px)');

        const handleMediaQuery = (mquery) => {
            if (mquery.matches) {
                logo.style.display = 'none';
                logoMini.style.display = 'block';
            } else {
                logo.style.display = 'block';
                logoMini.style.display = 'none';
            }
        };

        handleMediaQuery(mediaQuery);
        mediaQuery.addEventListener('change', handleMediaQuery);
    }

    #addToggleFunctionality(shadow) {
        const toggleBtn = shadow.getElementById('toggleBtn');
        const mobileMenu = shadow.getElementById('mobileMenu');

        toggleBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        toggleBtn.addEventListener('blur', () => {
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 75);
        });
    }
}