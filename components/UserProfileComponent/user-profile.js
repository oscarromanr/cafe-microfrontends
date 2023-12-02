//servicios
import Swal from "../../node_modules/sweetalert2/src/sweetalert2.js";

export class UserProfile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });

        document.addEventListener('DOMContentLoaded', () => {
            this.#render(shadow);
            this.#initButtons(shadow);
            this.#setupFormActions(shadow);
            this.#setupAccountActions(shadow);
        });
    }

    #render(shadow){
        shadow.innerHTML = `
        <link rel="stylesheet" href="../../components/UserProfileComponent/css/user-profile.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">

        <section class="bg-brown-50">
            <div class="container flex flex-col p-12 items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
            </div>   
            <div class="container flex flex-col items-center justify-between max-w-screen-xl mx-auto md:flex-row bg-brown-50">
                <div class="flex flex-col justify-between mx-auto mb-2 md:mb-0 md:w-fit pb-16">
                    <div class="w-full mx-auto">
                        <h1 class="text-brown-100 text-2xl md:text-4xl mx-auto mt-8 p-8 text-center font-medium font-helvetica">Bienvenido nombre_de_usuario</h1>
                        <p class="text-brown-300 text-center font-roboto mx-auto text-lg md:text-xl px-8 md:px-20">En esta página puedes realizar acciones con tu cuenta y editar tu información personal.</p>
                    </div>
                </div>
            </div>   

            <div class="z-10 p-8 w-full bg-brown-400">
                <div class="mx-auto mb-4 p-4 max-w-3xl">
                    <h2 class="text-brown-300 text-2xl md:text-2xl font-medium mb-8">Información personal</h2>
                    
                    <form method="get" id="formUserData">
                        <div class="flex flex-col md:flex-row mb-4">
                            <div class="w-full mr-2 mb-4 md:mb-0">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="nombre">
                                    Nombre
                                </label>
                                <input id="nombre" type="text" class="w-full p-2 border bg-gray-200 rounded text-brown-300"
                                   autofocus="" disabled value="${"nombre"}" maxlength="50" required>
                            </div> 
                            <div class="w-full">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="email">
                                    Correo electrónico
                                </label>
                                <input id="email" type="email" class="w-full p-2 border bg-gray-200 rounded text-brown-300"
                                    autofocus="" disabled value="${"correo@gmail.com"}" maxlength="100" required>
                            </div> 
                        </div>
                        

                        <div class="flex flex-col md:flex-row mb-4">
                            <div class="w-full mr-2 mb-4 md:mb-0">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="calle">
                                    Calle
                                </label>
                                <input id="calle" type="text" class="w-full p-2 border bg-gray-200 rounded text-brown-300"
                                   autofocus="" disabled value="${"calle"}" maxlength="100" required>
                            </div> 
                            <div class="w-full">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="numCasa">
                                    Número de casa
                                </label>
                                <input id="numCasa" type="number" class="w-full p-2 border bg-gray-200 rounded text-brown-300"
                                    autofocus="" disabled value="${"123"}" maxlength="15" required>
                            </div> 
                        </div>

                        <div class="flex flex-col md:flex-row mb-4">
                            <div class="w-full mr-2 mb-4 md:mb-0">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="colonia">
                                    Colonia
                                </label>
                                <input id="colonia" type="text" class="w-full p-2 border bg-gray-200 rounded  text-brown-300"
                                   autofocus="" disabled value="${"calle"}" maxlength="100" required>
                            </div> 
                            <div class="w-full">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="telefono">
                                    Teléfono
                                </label>
                                <input id="telefono" type="number" class="w-full p-2 border bg-gray-200 rounded text-brown-300"
                                    autofocus="" disabled value="${"123"}" maxlength="15" required>
                            </div> 
                        </div>

                        <div class="flex flex-col md:flex-row mb-4">
                            <div class="w-full mr-2 mb-4 md:mb-0">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="password">
                                    Contraseña
                                </label>
                                <div class="relative">
                                    <input id="password" type="password" class="w-full p-2 border bg-gray-200 rounded text-brown-300"
                                        autofocus="" disabled value="" minlength="8" maxlength="50" required>
                                    <span id="togglePassword" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <i class="text-brown-300 fa fa-eye-slash"></i>
                                    </span>
                                </div>
                            </div> 
                            <div class="w-full relative">
                                <label class="block mb-2 text-xs font-bold tracking-wide uppercase text-brown-300" for="confirm-password">
                                    Confirmar Contraseña
                                </label>
                                <div class="relative">
                                    <input id="confirm-password" type="password" class="w-full p-2 border bg-gray-200 rounded text-brown-300"
                                        autofocus="" disabled value="" minlength="8" maxlength="50" required>
                                    <span id="toggleConfirmPassword" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <i class="text-brown-300 fa fa-eye-slash"></i>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col md:flex-row mb-4">
                            <button id="btnEditInfo" type="button" class="w-full transition duration-150 mr-2 mb-4 p-2 md:mb-0 bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-l rounded">
                                <i class="fas fa-pen-to-square mr-2"></i>Editar información
                            </button> 
                            <button id="btnConfirmChanges" disabled class="w-full transition duration-150 mb-4 p-2 md:mb-0 bg-green-500 text-brown-50 hover:drop-shadow-l rounded">
                            <i class="fas fa-user-pen mr-2"></i>Confirmar cambios
                            </button> 
                        </div>
                    </form>
                </div>
            </div>

            <div class="z-10 p-8 w-full bg-brown-50">
                <div class="mx-auto mb-4 p-4 max-w-3xl">
                    <h2 class="text-brown-300 text-center text-2xl md:text-3xl font-medium">Acciones de cuenta</h2>
                </div>
                <div class="flex flex-col mb-4 max-w-lg mx-auto p-2">
                    <button id="btnLogout" type="button" class="w-full transition duration-150 mr-2 mb-4 p-2 bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-l rounded">
                        <i class="fas fa-right-from-bracket mr-2"></i>Cerrar sesión
                    </button>
                    <button id="btnChangePassword" type="button" class="w-full transition duration-150 mr-2 mb-4 p-2 bg-brown-100 text-brown-50 hover:bg-brown-300 hover:text-white hover:drop-shadow-l rounded">
                        <i class="fas fa-user-pen mr-2"></i>Cambiar contraseña
                    </button>
                    <button id="btnDeleteAccount" type="button" class="w-full transition duration-150 mb-4 p-2 bg-red-600 hover:bg-red-900 text-brown-50 hover:text-white hover:drop-shadow-l rounded">
                        <i class="fas fa-user-slash mr-2"></i>Eliminar cuenta
                    </button>
                </div>
            </div>
        </section>
        `;
    }

    #initButtons(shadow){
        const btnEditInfo = shadow.querySelector('#btnEditInfo');
        const btnConfirmChanges = shadow.querySelector('#btnConfirmChanges');

        btnEditInfo.addEventListener('click', () => {
            const inputs = shadow.querySelectorAll('#nombre, #email, #calle, #numCasa, #colonia, #telefono, #password, #confirm-password');

            inputs.forEach(input => {
                input.disabled = false;
                input.classList.remove('bg-gray-200');
                input.classList.add('bg-white');
            });

            btnConfirmChanges.disabled = false;
            btnConfirmChanges.classList.add('hover:bg-green-900');
            btnConfirmChanges.classList.add('hover:text-white');
        });
    }

    #setupFormActions(shadow){
        // Toggle password visibility functionallity
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
        
        const form = shadow.querySelector('#formUserData');
        
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            // sweet alert for update confirmation in spanish
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir los cambios una vez confirmados.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#0E9F6E',
                cancelButtonColor: '#E53E3E',
                confirmButtonText: 'Sí, confirmar cambios',
                cancelButtonText: 'Cancelar',
                background: '#F9F5F3', 
                color: '#36241C',
                iconColor: '#815F51'
            }).then((result) => {
                if (result.isConfirmed) {
                    const passwordInput = shadow.querySelector('#password');
                    const confirmPasswordInput = shadow.querySelector('#confirm-password');
                    
                    if (passwordInput.value !== confirmPasswordInput.value) {
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

                    // TODO: aqui realizar la peticion al backend para actualizar la informacion del usuario
                    // changesMade representa el exito de la petición, de momento es solo para testear la funcionalidad
                    const changesMade = true;

                    if (changesMade){
                        Swal.fire({
                            title: '¡Cambios confirmados!',
                            text: 'Tus cambios han sido confirmados.',
                            icon: 'success',
                            confirmButtonColor: '#815F51',
                            background: '#F9F5F3', 
                            iconColor: '#815F51',
                            color: '#36241C'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Error al actualizar',
                            text: 'No se ha podido actualizar tu información. Intente de nuevo más tarde.',
                            icon: 'error',
                            iconColor: '#815F51',
                            confirmButtonColor: '#815F51',
                            background: '#F9F5F3', 
                            color: '#36241C'
                        });
                    }
                    
                } else {
                    Swal.fire({
                        title: 'Cambios cancelados',
                        text: 'No se han realizado modificaciones.',
                        icon: 'warning',
                        iconColor: '#815F51',
                        confirmButtonColor: '#815F51',
                        background: '#F9F5F3', 
                        color: '#36241C'
                    });
                }
            });
        });
    }

    #setupAccountActions(shadow){

        const btnLogout = shadow.querySelector('#btnLogout');
        const btnChangePassword = shadow.querySelector('#btnChangePassword');
        const btnDeleteAccount = shadow.querySelector('#btnDeleteAccount');

        btnLogout.addEventListener('click', () => {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir el cierre de sesión una vez confirmado.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#815F51',
                cancelButtonColor: '#E53E3E',
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar',
                background: '#F9F5F3', 
                color: '#36241C',
                iconColor: '#815F51'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'index.html';
                }
            });
        });

        btnChangePassword.addEventListener('click', () => {
            Swal.fire({
                title: 'Cambiar contraseña',
                icon: 'info',
                html: `
                    <div class="relative mb-2">
                        <input id="currentPassword" type="password" class="w-full p-2 border bg-brown-25 rounded text-brown-300" autofocus="" placeholder="Contraseña actual" minlength="8" maxlength="50" required>
                        <span id="togglePassCurrent" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <i class="text-brown-300 fa fa-eye-slash"></i>
                        </span>
                    </div>
                    <div class="relative mb-2">
                        <input id="newPassword" type="password" class="w-full p-2 border bg-brown-25 rounded text-brown-300" autofocus="" placeholder="Contraseña nueva" minlength="8" maxlength="50" required>
                        <span id="togglePassNew" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <i class="text-brown-300 fa fa-eye-slash"></i>
                        </span>
                    </div>
                    <div class="relative mb-2">
                        <input id="confirmNewPassword" type="password" class="w-full p-2 border bg-brown-25 rounded text-brown-300" autofocus="" placeholder="Confirmar contraseña nueva" minlength="8" maxlength="50" required>
                        <span id="togglePassConfirmNew" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <i class="text-brown-300 fa fa-eye-slash"></i>
                        </span>
                    </div>
                    <div class="relative mb-2 pt-4 mt-4 items-center justify-center mx-auto">
                        <input id="confirmChangePassword" type="checkbox" class="mr-2 p-2 bg-brown-25 border-brown-300 text-brown-100 rounded focus:ring-brown-100">
                        <label for="confirmChangePassword">Acepto que los cambios son irreversibles</label>
                    </div>
                `,
                focusConfirm: false,
                confirmButtonColor: '#815F51',
                showCancelButton: true,
                cancelButtonColor: '#E53E3E',
                cancelButtonText: 'Cancelar',
                background: '#F9F5F3', 
                color: '#36241C',
                iconColor: '#815F51',
                preConfirm: () => {
                    const currentPassword = Swal.getPopup().querySelector('#currentPassword').value;
                    const newPassword = Swal.getPopup().querySelector('#newPassword').value;
                    const confirmNewPassword = Swal.getPopup().querySelector('#confirmNewPassword').value;
                    const confirmChangePassword = Swal.getPopup().querySelector('#confirmChangePassword').checked;
                    
                    if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
                        Swal.showValidationMessage('Por favor, complete todos los campos');
                    } else if (newPassword.length < 8 || confirmNewPassword.length < 8) {
                        Swal.showValidationMessage('Las contraseñas deben tener al menos 8 caracteres');
                    } else if (newPassword !== confirmNewPassword) {
                        Swal.showValidationMessage('Las contraseñas no coinciden');
                    } else if (!confirmChangePassword) {
                        Swal.showValidationMessage('Por favor, confirme el cambio de contraseña');
                    } else {
                        return { currentPassword, newPassword, confirmNewPassword };
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    // TODO: realizar la petición al backend para actualizar la contraseña del usuario
                    // changesMade representa el exito de la petición, de momento es solo para testear la funcionalidad
                    const changesMade = true;

                    if (changesMade) {
                        Swal.fire({
                            title: '¡Contraseña modificada!',
                            text: 'Tu contraseña ha sido cambiada exitosamente.',
                            icon: 'success',
                            confirmButtonColor: '#815F51',
                            background: '#F9F5F3', 
                            color: '#36241C',
                            iconColor: '#815F51'
                        });
                    } else {
                        Swal.fire({
                            title: 'Error al actualizar',
                            text: 'No se ha podido actualizar tu contraseña. Intente de nuevo más tarde.',
                            icon: 'error',
                            iconColor: '#815F51',
                            confirmButtonColor: '#815F51',
                            background: '#F9F5F3',
                            color: '#36241C'
                        });
                    }
                } 
            });

            const togglePassCurrent = document.getElementById('togglePassCurrent');
            const togglePassNew = document.getElementById('togglePassNew');
            const togglePassConfirmNew = document.getElementById('togglePassConfirmNew');

            togglePassCurrent.addEventListener('click', () => {
                const currentPasswordInput = document.getElementById('currentPassword');
                togglePasswordVisibility(currentPasswordInput);
            });

            togglePassNew.addEventListener('click', () => {
                const newPasswordInput = document.getElementById('newPassword');
                togglePasswordVisibility(newPasswordInput);
            });

            togglePassConfirmNew.addEventListener('click', () => {
                const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
                togglePasswordVisibility(confirmNewPasswordInput);
            });

            function togglePasswordVisibility(input) {
                const type = input.getAttribute('type');
                if (type === 'password') {
                    input.setAttribute('type', 'text');
                    input.nextElementSibling.innerHTML = '<i class="text-brown-300 fa fa-eye"></i>';
                } else {
                    input.setAttribute('type', 'password');
                    input.nextElementSibling.innerHTML = '<i class="text-brown-300 fa fa-eye-slash"></i>';
                }
            }
        });

        btnDeleteAccount.addEventListener('click', () => {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir la eliminación de tu cuenta una vez confirmada.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#815F51',
                cancelButtonColor: '#E53E3E',
                confirmButtonText: 'Sí, eliminar cuenta',
                cancelButtonText: 'Cancelar',
                background: '#F9F5F3', 
                color: '#36241C',
                iconColor: '#815F51'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Cuenta eliminada',
                        text: "Tu cuenta ha sido eliminada exitosamente.",
                        icon: 'success',
                        confirmButtonColor: '#815F51',
                        background: '#F9F5F3', 
                        color: '#36241C',
                        iconColor: '#815F51'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = 'index.html';
                        }
                    });
                }
            });
        });        
    }
}