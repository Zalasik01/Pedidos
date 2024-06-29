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

// Pega 
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        //Se o item já existe aumenta a quantidade +1
        existingItem.quantity += 1;
    
    }else{

    cart.push({
        name,
        price,
        quantity: 1,
    })
    }
    updateCartModal()
}


// Atualiza o carrinho
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
        document.getElementById('footer-cart-total').innerText = total.toFixed(2)

    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    cartCounter.innerHTML = cart.length;
}

// Função para remover item do carrinho
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

// Função de captação de endereço
addresInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addresInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden") 
    }
})


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

    // Enviar pedido para whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} - (${item.quantity}) Preço: R$ ${item.price} | `
    )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "5547991884707"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addresInput.value}`, "_blank")
    cart.length = 0;
    updateCartModal();
})

// Verificar hora
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    const minutos = data.getMinutes();
    return (hora >= 18 && (hora < 23 || (hora === 23 && minutos < 30))); // true
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}