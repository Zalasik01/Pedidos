const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addresInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const observationInput = document.getElementById("observacao")
const nameInput = document.getElementById("name-input")
const nameInputWarn = document.getElementById("name-input-warn")
const pagamentoInputs = document.getElementsByName("forma-pagamento");
const pagamentoWarn = document.getElementById("pagament-input-warn");
const houseNumber = document.getElementById("house-number");
const houseNumberWarn = document.getElementById("house-number-warn");
let cart = [];

// Abrir modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = 'flex'    
})

// Fechar modal do carrinho
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = 'none'
})

// Pegar item do menu
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

// Adicionar item ao carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}

// Atualizar modal do carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
       const cartItemElement = document.createElement("div");
       cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

       cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
            <p class="font-bold">${item.name}</p>
            <p>Quantidade: ${item.quantity}</p>
            <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
            Remover
            </button>
        </div>       
       `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
        document.getElementById('cart-total').innerText = total.toFixed(2);
        document.getElementById('cart-total-pgto').innerText = total.toFixed(2);
        document.getElementById('footer-cart-total').innerText = total.toFixed(2)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;
}

// Remover item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

// Capturar endereço
addresInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addresInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden") 
    }
})

// Capturar número da casa
houseNumber.addEventListener("input", function(event) {
    let inputValue = event.target.value.trim();

    if (inputValue !== "") {
        houseNumber.classList.remove("border-red-500");
        houseNumberWarn.classList.add("hidden");
    } else {
        houseNumber.classList.add("border-red-500");
        houseNumberWarn.classList.remove("hidden");
    }
});

// Capturar nome
nameInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        nameInput.classList.remove("border-red-500")
        nameInputWarn.classList.add("hidden") 
    }
})

// Validar input
function handleInputValidation(inputElement, warningElement) {
    inputElement.addEventListener("input", function(event) {
        let inputValue = event.target.value;

        if (inputValue !== "") {
            inputElement.classList.remove("border-red-500");
            warningElement.classList.add("hidden");
        }
    });
}

// Aplicar função para o campo de nome
handleInputValidation(nameInput, nameInputWarn,);

// Validar forma de pagamento
function validatePayment() {
    let isPaymentSelected = false;

    pagamentoInputs.forEach(input => {
        if (input.checked) {
            isPaymentSelected = true;
        }
    });

    return isPaymentSelected;
}

// Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify ({
            text: "Estamos fechados no momento, tente novamente mais tarde",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#EF4444",
            },
        }).showToast();
        return;
    }


    if(cart.length === 0) return;
    if(addresInput.value === ""){
        addressWarn.classList.remove("hidden")
        addresInput.classList.add("border-red-500")
        return;
    }
    if(nameInput.value === ""){
        nameInputWarn.classList.remove("hidden")
        nameInput.classList.add("border-red-500")
        return;
    }
    if(houseNumber.value === ""){
        houseNumberWarn.classList.remove("hidden")
        houseNumber.classList.add("border-red-500")
        return;
    }


    // Validar forma de pagamento
    if (!validatePayment()) {
        pagamentoWarn.classList.remove("hidden");
        return;
    }

    // Montar mensagem para enviar via WhatsApp
    const cartItems = cart.map((item) => {
        return (
            `➡ ${item.name}: ${item.quantity} un. \n       Valor: R$ ${item.price.toFixed(2)}\n\n`
        )
    }).join("");

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

    const greeting = getGreeting(); // Obter saudação
    const selectedPayment = Array.from(pagamentoInputs).find(input => input.checked).id;

        const message = encodeURIComponent(`🤖 ${greeting}. Me chamo *${nameInput.value}*, aqui estão os itens do meu pedido: \n\n${cartItems}\nTotal: R$ ${total}\nForma de pagamento: ${selectedPayment}
    \n🛵 *Endereço:* ${addresInput.value}, ${houseNumber.value} \n📋 *Observação:* ${observationInput.value}\n🏦 *Forma de pagamento:* ${selectedPayment}`);
    
    const phone = "5547991884707";
    const whatsappLink = `https://wa.me/${phone}?text=${message}`;

    // Redirecionar para o link do WhatsApp
    window.open(whatsappLink, "_blank");

    // Limpar carrinho, observação e endereço
    cart.length = 0;
    addresInput.value = "";
    observationInput.value = "";
    pagamentoInputs.forEach(input => {
        input.checked = false;
    });

    // Fechar modal
    closeModalBtn.click();
    updateCartModal();
});

// Verificar se o restaurante está aberto
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();
    return (hora >= 05 && (hora < 23 || (hora === 23 && minutos < 30))); // true
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
    spanItem.classList.add("hover:bg-red-700")
}

// Determinar saudação com base no horário
function getGreeting() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 18 || hour < 12) {
        return "Boa noite";
    } else {
        return "Boa tarde";
    }
}
