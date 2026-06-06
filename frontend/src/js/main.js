const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const productList = document.querySelector(".products__list");
const productArrows = document.querySelectorAll(".products__arrow");
const buyButtons = document.querySelectorAll(".js-buy-now");
const modal = document.querySelector(".cart-modal");
const modalName = document.querySelector(".cart-modal__name");
const modalPrice = document.querySelector(".cart-modal__price");
const modalQty = document.querySelector(".cart-modal__input");
const modalStatus = document.querySelector(".cart-modal__status");
const addToCartButton = document.querySelector(".cart-modal__button");
const closeModalButtons = document.querySelectorAll("[data-close-modal]");
const cartButton = document.querySelector(".cart-button");
const cartCount = document.querySelector(".cart-button__count");
const cartDrawer = document.querySelector(".cart-drawer");
const cartItems = document.querySelector(".cart-drawer__items");
const cartSubtotal = document.querySelector(".cart-drawer__subtotal");
const cartDelivery = document.querySelector(".cart-drawer__delivery");
const cartTotal = document.querySelector(".cart-drawer__total-price");
const cartCheckout = document.querySelector(".cart-drawer__checkout");
const cartStatus = document.querySelector(".cart-drawer__status");
const closeCartButtons = document.querySelectorAll("[data-close-cart]");
const questionForm = document.querySelector(".question__form");
const questionInput = document.querySelector(".question__input");
const questionStatus = document.querySelector(".question__status");

const cart = [];
const deliveryPrice = 4.99;

const formatPrice = (value) => `$${value.toFixed(2)}`;
const parsePrice = (price) => Number(String(price).replace("$", "")) || 0;

const setMenuState = (isOpen) => {
    nav?.classList.toggle("is-open", isOpen);
    menuToggle?.classList.toggle("is-active", isOpen);
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
};

const setPageLock = () => {
    const hasOverlay = modal?.classList.contains("is-open") || cartDrawer?.classList.contains("is-open");
    document.body.classList.toggle("modal-open", Boolean(hasOverlay));
};

const openCart = () => {
    if (!cartDrawer) return;

    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    setPageLock();
};

const closeCart = () => {
    if (!cartDrawer) return;

    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    setPageLock();
};

const renderCart = () => {
    if (!cartItems) return;

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const delivery = totalItems > 0 ? deliveryPrice : 0;
    const total = subtotal + delivery;

    cartCount.textContent = String(totalItems);
    cartSubtotal.textContent = formatPrice(subtotal);
    cartDelivery.textContent = formatPrice(delivery);
    cartTotal.textContent = formatPrice(total);
    cartCheckout.disabled = totalItems === 0;
    cartDrawer.classList.toggle("has-items", totalItems > 0);

    cartItems.innerHTML = cart.map((item) => `
        <article class="cart-item" data-name="${item.name}">
            <div class="cart-item__top">
                <div>
                    <h3 class="cart-item__name">${item.name}</h3>
                    <span class="cart-item__price">${formatPrice(item.price)} each</span>
                </div>
                <button class="cart-item__remove" type="button" aria-label="Remove ${item.name}" data-cart-remove="${item.name}">&times;</button>
            </div>
            <div class="cart-item__bottom">
                <div class="cart-item__qty" aria-label="${item.name} quantity">
                    <button type="button" aria-label="Decrease ${item.name}" data-cart-decrease="${item.name}">-</button>
                    <span>${item.qty}</span>
                    <button type="button" aria-label="Increase ${item.name}" data-cart-increase="${item.name}">+</button>
                </div>
                <strong class="cart-item__total">${formatPrice(item.price * item.qty)}</strong>
            </div>
        </article>
    `).join("");
};

const addItemToCart = ({ name, price, qty }) => {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }

    cartStatus.textContent = "";
    renderCart();
};

const updateCartItem = (name, change) => {
    const item = cart.find((cartItem) => cartItem.name === name);
    if (!item) return;

    item.qty += change;

    if (item.qty <= 0) {
        const index = cart.findIndex((cartItem) => cartItem.name === name);
        cart.splice(index, 1);
    }

    cartStatus.textContent = "";
    renderCart();
};

const removeCartItem = (name) => {
    const index = cart.findIndex((item) => item.name === name);
    if (index === -1) return;

    cart.splice(index, 1);
    cartStatus.textContent = "";
    renderCart();
};

const openModal = ({ name, price }) => {
    if (!modal) return;

    modalName.textContent = name || "Pistachio Dream";
    modalPrice.textContent = price || "$19.55";
    modalQty.value = "1";
    modalStatus.textContent = "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    setPageLock();
    modalQty.focus();
};

const closeModal = () => {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    setPageLock();
};

menuToggle?.addEventListener("click", () => {
    setMenuState(!nav?.classList.contains("is-open"));
});

nav?.addEventListener("click", (event) => {
    if (event.target.closest(".nav__link")) {
        setMenuState(false);
    }
});

productArrows.forEach((arrow, index) => {
    arrow.addEventListener("click", () => {
        if (!productList) return;

        const card = productList.querySelector(".product-card");
        const cardWidth = card ? card.getBoundingClientRect().width + 20 : 270;
        productList.scrollBy({
            left: index === 0 ? -cardWidth : cardWidth,
            behavior: "smooth",
        });
    });
});

buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
        openModal({
            name: button.dataset.name,
            price: button.dataset.price,
        });
    });
});

closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
});

cartButton?.addEventListener("click", openCart);

closeCartButtons.forEach((button) => {
    button.addEventListener("click", closeCart);
});

cartItems?.addEventListener("click", (event) => {
    const decreaseButton = event.target.closest("[data-cart-decrease]");
    const increaseButton = event.target.closest("[data-cart-increase]");
    const removeButton = event.target.closest("[data-cart-remove]");

    if (decreaseButton) {
        updateCartItem(decreaseButton.dataset.cartDecrease, -1);
    }

    if (increaseButton) {
        updateCartItem(increaseButton.dataset.cartIncrease, 1);
    }

    if (removeButton) {
        removeCartItem(removeButton.dataset.cartRemove);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
        closeCart();
        setMenuState(false);
    }
});

addToCartButton?.addEventListener("click", () => {
    const qty = Math.max(1, Number(modalQty.value) || 1);
    const name = modalName.textContent;
    const price = parsePrice(modalPrice.textContent);

    modalQty.value = String(qty);
    addItemToCart({ name, price, qty });
    modalStatus.textContent = `${name} added to cart.`;
    closeModal();
    openCart();
});

cartCheckout?.addEventListener("click", () => {
    if (cart.length === 0) return;

    cartStatus.textContent = "Order created! We will prepare it for cold delivery.";
});

questionForm?.addEventListener("click", (event) => {
    if (!event.target.closest(".question__button")) return;

    questionStatus.textContent = "Thank you! We will contact you soon.";
    questionInput.value = "";
});

renderCart();
