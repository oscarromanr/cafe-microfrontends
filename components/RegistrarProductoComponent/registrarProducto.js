import { ServicioProducto } from "../../Servicio/productoServicio.js";
export class RegistrarProducto extends HTMLElement {
    #servicioProducto = new ServicioProducto();
    #filesArray = [];
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', () => {
            this.#render(shadow);
            this.#seleccionarArchivo
            let addProduct = this.shadowRoot.querySelector('#addProduct');
            console.log(addProduct)
            addProduct.addEventListener('click', (event) => {
                event.preventDefault();
                const nombre = this.shadowRoot.querySelector('#grid-nombre').value;
                console.log(nombre)
                const categoria = this.shadowRoot.querySelector('#grid-categoria').value;
                const price = this.shadowRoot.querySelector('#grid-precio').value;
                const cantidad = this.shadowRoot.querySelector('#grid-stock').value;
                const imagenurl = this.shadowRoot.querySelector('#grid-img').value;
                const descripcion = this.shadowRoot.querySelector('#grid-descripcion').value;
                console.log('Hola')
                if (nombre == '' && categoria == '' && precio == '' && stock == '' && imagenurl == '' && descripcion == '') {
                    alert('Faltan campos por llenar');
                } else {
                    if (!isNaN(price) && !isNaN(cantidad)) {
                        const precio = parseFloat(price);
                        console.log(precio);
                        const stock = parseInt(cantidad);
                        console.log(cantidad);
                        const productData = { nombre, categoria, precio, stock, imagenurl, descripcion }
                        const respuesta = this.#servicioProducto.crearProducto(productData);
                        console.log(respuesta);
                        window.location.href = '../src/admin-index.html';
                    } else {
                        alert('Hay caracteres en los campos precio y stock')
                    }
                }
            });
        });
    }

    #render(shadow) {
        shadow.innerHTML = `
        <link rel="stylesheet" href="../../components/RegistrarProductoComponent/css/registrarProducto.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
        
        <section class="bg-brown-50">
            <div class="container flex flex-col items-center justify-between max-w-screen-xl p-12 mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-center max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                <div class="flex flex-col justify-between mb-8 md:mb-0 md:w-fit">
                    <div class="w-full mx-auto">
                        <h1 class="p-8 mt-8 text-4xl font-medium text-center text-brown-100 md:text-5xl font-helvetica">Agregar nuevo producto</h1>
                    </div>
                </div>
            </div>    
        </section>
        
        <section class="flex flex-col items-center justify-center w-full py-8 bg-brown-400">
            <div class="p-8">
                <form class="w-full max-w-3xl" method="POST" enctype="text/plain">
                    <div class="flex flex-wrap mb-6 -mx-3">
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="nombre">
                                Nombre *
                            </label>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-nombre" type="text" placeholder="Café organico" required>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="categoria">
                                Categoría *
                            </label>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-categoria" type="text" placeholder="Café en grano" required>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="precio">
                                Precio *
                            </label>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-precio" type="text" required>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="stock">
                                Stock *
                            </label>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-stock" type="text" placeholder="Cantidad" required>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3" id="drop-area">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="imagen">
                                Imagen *
                            </label>
                            <button id="fileInputBtn" class="px-4 py-2 font-bold transition duration-200 rounded shadow bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white focus:shadow-outline focus:outline-none">
                                Seleccionar archivo
                            </button>
                            <input class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-img" type="file" placeholder="Arrastre y suelte un archivo" required>
                            <ul id="fileList" class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300"></ul>
                        </div>
                        <div class="w-full px-3 mb-0 md:mb-3">
                            <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="descripcion">
                                Descripción *
                            </label>
                            <textarea class="block w-full px-4 py-3 mb-3 leading-tight border rounded appearance-none text-brown-300 bg-brown-25 border-brown-100 focus:outline-none focus:bg-brown-25" id="grid-descripcion" required></textarea>
                        </div>
                    </div>
                    <div class="md:flex md:items-center">
                        <div class="md:w-1/3">
                            <button id="addProduct" class="px-4 py-2 font-bold transition duration-200 rounded shadow bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white focus:shadow-outline focus:outline-none" type="submit">
                                Agregar producto
                            </button>
                        </div>
                        <div class="md:w-2/3"></div>
                    </div>
                </form>
            </div>
        </section>
        `
    }

    // #agregarProducto(event) {
    //     event.preventDefault();
    //     const nombre = this.shadowRoot.querySelector('#grid-nombre');
    //     console.log(nombre)
    //     const categoria = document.getElementById('grid-categoria').value;
    //     const price = document.getElementById('grid-precio').value;
    //     const cantidad = document.getElementById('grid-stock').value;
    //     const imagenurl = document.getElementById('grid-img').value;
    //     const descripcion = document.getElementById('grid-descripcion').value;
    //     console.log('Hola')
    //     if (nombre == '' && categoria == '' && precio == '' && stock == '' && imagenurl == '' && descripcion == '') {
    //         alert('Faltan campos por llenar');
    //     } else {
    //         if (!isNaN(price) && !isNaN(cantidad)) {
    //             const precio = parseFloat(price);
    //             console.log(precio);
    //             const stock = parseInt(cantidad);
    //             console.log(cantidad);
    //             const productData = { nombre, categoria, precio, stock, imagenurl, descripcion }
    //             const respuesta = this.#servicioProducto.crearProducto(productData);
    //             console.log(respuesta);
    //             window.location.href = '../src/admin-login.html';
    //         } else {
    //             alert('Hay caracteres en los campos precio y stock')
    //         }
    //     }
    // }

    #seleccionarArchivo() {
        const fileInputBtn = document.getElementById('fileInputBtn');
        const fileInput = document.getElementById('grid-img');
        const dropArea = document.getElementById('drop-area');
        const fileList = document.getElementById('fileList');

        dropArea.addEventListener('dragover', handlerDragOver);
        dropArea.addEventListener('drop', handlerDrop);

        fileInputBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', handlerFileSelect);

        // Función para manejar el evento de arrastrar sobre el área
        function handlerDragOver(event) {
            event.preventDefault();
            // Agrega una clase para resaltar visualmente el área de soltar
            dropArea.classList.add('drag-over');
        }

        // Función para manejar el evento de soltar archivos en el área
        function handlerDrop(event) {
            event.preventDefault();
            // Elimina la clase de resaltado visual del área de soltar
            dropArea.classList.remove('drag-over');

            // Obtiene los archivos del evento de soltar
            const files = event.dataTransfer.files;
            // Llama a la función para manejar los archivos
            handleFiles(files);
        }

        // Función para manejar la selección de archivos desde el cuadro de diálogo
        function handlerFileSelect(event) {
            // Obtiene los archivos seleccionados
            const files = event.target.files;
            // Llama a la función para manejar los archivos
            handleFiles(files);
        }

        // Función para manejar la lista de archivos
        function handleFiles(files) {
            // Itera sobre la lista de archivos y llama a la función para mostrar cada archivo
            for (const file of files) {
                displayFile(file);
            }
        }

        // Función para mostrar un archivo en la lista
        function displayFile(file) {

            this.#filesArray.push(file);

            // Crea un elemento de lista
            const listItem = document.createElement('li');
            listItem.classList.add('file-item');

            // Crea un elemento de span para el icono del tipo de archivo
            const fileIcon = document.createElement('span');
            fileIcon.classList.add('file-icon', getFileTypeIconClass(file.type));

            // Crea un elemento de span para el nombre del archivo
            const fileName = document.createElement('span');
            fileName.textContent = file.name + ' - ';

            // Crea un elemento de span para el tamaño del archivo
            const fileSize = document.createElement('span');
            fileSize.textContent = formatFileSize(file.size);

            // Crea un botón de "Quitar"
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Quitar';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', () => {
                // Elimina el elemento de lista cuando se hace clic en el botón de "Quitar"
                listItem.remove();
            });

            // Agrega los elementos al elemento de lista
            listItem.appendChild(fileIcon);
            listItem.appendChild(fileName);
            listItem.appendChild(fileSize);
            listItem.appendChild(removeButton);

            // Agrega el elemento de lista a la lista de archivos
            fileList.appendChild(listItem);
        }

        // Función para formatear el tamaño de archivo a KB o MB
        function formatFileSize(size) {
            const kilobyte = 1024;
            const megabyte = kilobyte * kilobyte;

            if (size < kilobyte) {
                return size + ' bytes';
            } else if (size < megabyte) {
                return (size / kilobyte).toFixed(2) + ' KB';
            } else {
                return (size / megabyte).toFixed(2) + ' MB';
            }
        }

        // Función para obtener la clase de icono según el tipo de archivo
        function getFileTypeIconClass(fileType) {
            // Mapea los tipos de archivo a clases de iconos
            const iconClasses = {
                'image/jpeg': 'icon-image',
                'image/png': 'icon-image'
            };

            // Retorna la clase de icono correspondiente al tipo de archivo
            return iconClasses[fileType] || iconClasses['default'];
        }
    }
}