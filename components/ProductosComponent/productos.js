import { ServicioProducto } from "../../Servicio/productoServicio.js";

export class Productos extends HTMLElement {
    #servicio = new ServicioProducto();
    #filterOptions = {
        price: '',
        name: '',
        category: ''
    };

    constructor() {
        super();
        this.productos = [];
        this.filteredProductos = [];

        this.#servicio.obtenerProductos().then(response => {
            this.productos = response.productos;
            this.filteredProductos = [...this.productos]; 
            this.#render();
        });
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
    }

    #render() {
        const shadow = this.shadowRoot;
        shadow.innerHTML = `
            <link rel="stylesheet" href="../../components/ProductosComponent/css/productos.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">

            <section class="bg-brown-50">
                <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                </div>   
                <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="flex flex-col justify-between mb-8 md:mb-0 md:w-fit">
                        <div class="w-full">
                            <h1 class="text-brown-100 text-4xl md:text-5xl mt-8 p-8 text-center font-medium font-helvetica">¡Conoce nuestros productos!</h1>
                            <p class="text-brown-300 text-center font-roboto text-lg md:text-xl px-8 mb-8 pb-10 md:px-20">Te invitamos a explorar nuestro catálogo y experimentar el verdadero sabor del café. En Café Tatiaxca, cada taza es una historia, cada sorbo es un deleite y cada producto es una obra maestra. ¡Disfruta de la magia del café y déjanos ser tu compañero en esta apasionante travesía!</p>
                        </div>
                    </div>
                </div>       
                <div class="z-10 p-8 w-full bg-brown-25">
                    <div class="mb-4 w-full max-w-5xl md:p-6 mx-auto flex flex-col md:flex-row items-center md:gap-y-20 gap-x-4 mt-4 justify-end">
                        <div class="flex flex-col md:flex-row items-center">
                            <label for="filterBy" class="mr-2 md:pb-1 pb-3">Filtrar por:</label>
                            <select id="filterBy" class="border border-brown-300 rounded-md px-2 py-1">
                                <option value="" ${this.#filterOptions.price === '' && this.#filterOptions.name === '' ? 'selected' : ''}>Todos</option>
                                <option value="price_asc" ${this.#filterOptions.price === 'asc' ? 'selected' : ''}>Precio: Menor a Mayor</option>
                                <option value="price_desc" ${this.#filterOptions.price === 'desc' ? 'selected' : ''}>Precio: Mayor a Menor</option>
                                <option value="name_asc" ${this.#filterOptions.name === 'asc' ? 'selected' : ''}>Nombre: A - Z</option>
                                <option value="name_desc" ${this.#filterOptions.name === 'desc' ? 'selected' : ''}>Nombre: Z - A</option>
                            </select>
                        </div>
                        <div class="flex flex-col md:flex-row items-center mt-4 md:mt-0">
                            <label for="filterByCategory" class="mr-2 md:pb-1 pb-3">Categoría:</label>
                            <select id="filterByCategory" class="border border-brown-300 rounded-md px-2 py-1">
                                <option value="" ${this.#filterOptions.category === '' ? 'selected' : ''}>Todos</option>
                                <option value="Café en grano" ${this.#filterOptions.category === 'Café en grano' ? 'selected' : ''}>Café en grano</option>
                                <option value="Repostería" ${this.#filterOptions.category === 'Repostería' ? 'selected' : ''}>Repostería</option>
                                <option value="Accesorios" ${this.#filterOptions.category === 'Accesorios' ? 'selected' : ''}>Accesorios</option>
                            </select>
                        </div>

                        <button id="applyFilter" class="bg-brown-100 duration-100 transition hover:bg-brown-300 text-brown-50 hover:text-white px-8 py-2 rounded-md mt-4 md:mt-0">Aplicar filtro</button>
                    </div>

                    <section class="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                        ${this.filteredProductos.map(producto => this.#renderCard(producto)).join('')}
                    </section>
                </div>

                <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                    <div class="flex flex-col justify-between mb-8 md:mb-0 md:w-fit">
                        <div class="w-full">
                            <h1 class="text-brown-100 text-4xl md:text-5xl mt-8 p-8 text-center font-medium font-helvetica">Agradecemos tu preferencia</h1>
                            <p class="text-brown-300 text-center font-roboto text-lg md:text-xl px-8 mb-8 pb-10 md:px-20">En Café Tatiaxca nos preocupamos por tu opinión, si tienes alguna queja o sugerencia no dudes en hacérnoslo saber a través de nuestro formulario de contacto!</p>
                        </div>
                    </div>
                </div>   
            </section>

        `;

        const filterBySelect = shadow.getElementById('filterBy');
        const filterByCategorySelect = shadow.getElementById('filterByCategory');
        const applyFilterButton = shadow.getElementById('applyFilter');

        filterBySelect.addEventListener('change', () => {
            this.#filterOptions.price = '';
            this.#filterOptions.name = '';

            const selectedOption = filterBySelect.value;
            if (selectedOption === 'price_asc') {
                this.#filterOptions.price = 'asc';
            } else if (selectedOption === 'price_desc') {
                this.#filterOptions.price = 'desc';
            } else if (selectedOption === 'name_asc') {
                this.#filterOptions.name = 'asc';
            } else if (selectedOption === 'name_desc') {
                this.#filterOptions.name = 'desc';
            }
        });

        filterByCategorySelect.addEventListener('change', () => {
            this.#filterOptions.category = filterByCategorySelect.value;
        });

        applyFilterButton.addEventListener('click', () => {
            this.#applyFilter();
        });
    }

    #renderCard(producto) {
        return `
            <div class="w-72 bg-white shadow-md rounded-xl duration-300 hover:scale-105 hover:shadow-xl">
                <a href="#">
                    <img src="../../img/${producto.imagenurl}" alt="Producto" class="h-80 w-72 object-cover rounded-t-xl" />
                    <div class="px-4 py-3 w-72 font-helvetica">
                        <span class="text-brown-300 text-opacity-70 mr-3 uppercase text-xs">${producto.categoria}</span>
                        <p class="text-lg font-bold text-brown-300 truncate block capitalize">${producto.nombre}</p>
                        <div class="flex items-center">
                            <p class="text-lg font-semibold text-brown-300 cursor-auto my-3">$${producto.precio}</p>
                            <div class="ml-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }

    #applyFilter() {
    let filteredProductos = [...this.productos];

    if (this.#filterOptions.price === 'asc') {
        filteredProductos.sort((a, b) => a.precio - b.precio);
    } else if (this.#filterOptions.price === 'desc') {
        filteredProductos.sort((a, b) => b.precio - a.precio);
    } else if (this.#filterOptions.name === 'asc') {
        filteredProductos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.#filterOptions.name === 'desc') {
        filteredProductos.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    if (this.#filterOptions.category !== '') {
        filteredProductos = filteredProductos.filter(producto => producto.categoria === this.#filterOptions.category);
    }

    this.filteredProductos = filteredProductos;
    this.#render();
    }

    
}
