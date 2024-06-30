document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.querySelector('#username');
    const saveUserCheckbox = document.querySelector('#saveUser');
    const validateUserButton = document.querySelector('#validateUser');

    // Verifica se o nome de usuário está armazenado no localStorage
    if (localStorage.getItem('savedUsername')) {
        usernameInput.value = localStorage.getItem('savedUsername');
        saveUserCheckbox.checked = true;
    }

    // Adiciona um listener para alternar a visibilidade da senha
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');

    togglePassword.addEventListener('click', function () {
        // alternar o atributo 'type'
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        
        // alternar o ícone
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Adiciona um listener para armazenar o nome de usuário quando o checkbox é clicado
    saveUserCheckbox.addEventListener('change', function () {
        if (saveUserCheckbox.checked) {
            localStorage.setItem('savedUsername', usernameInput.value);
        } else {
            localStorage.removeItem('savedUsername');
        }
    });

    // Armazena o nome de usuário quando o campo de entrada perde o foco
    usernameInput.addEventListener('blur', function () {
        if (saveUserCheckbox.checked) {
            localStorage.setItem('savedUsername', usernameInput.value);
        }
    });

    // Adiciona um listener para validar o nome de usuário quando o botão é clicado
    validateUserButton.addEventListener('click', function () {
        const username = usernameInput.value.trim();
        if (username === "") {
            Toastify({
                text: "Usuário valido. Carregando informações",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "#10B981",
                },
            }).showToast();
        } else {
            Toastify({
                text: "Nome de usuário invalido. Tente novamente!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "#EF4444",
                },
            }).showToast();
        }
    });
});