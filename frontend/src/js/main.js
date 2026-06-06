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
const questionForm = document.querySelector(".question__form");
const questionInput = document.querySelector(".question__input");
const questionStatus = document.querySelector(".question__status");

const setMenuState = (isOpen) => {
    nav?.classList.toggle("is-open", isOpen);
    menuToggle?.classList.toggle("is-active", isOpen);
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
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

const openModal = ({ name, price }) => {
    if (!modal) return;

    modalName.textContent = name || "Pistachio Dream";
    modalPrice.textContent = price || "$19.55";
    modalQty.value = "1";
    modalStatus.textContent = "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalQty.focus();
};

const closeModal = () => {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
};

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

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
        setMenuState(false);
    }
});

addToCartButton?.addEventListener("click", () => {
    const qty = Math.max(1, Number(modalQty.value) || 1);
    modalQty.value = String(qty);
    modalStatus.textContent = `${modalName.textContent} added to cart.`;
});

questionForm?.addEventListener("click", (event) => {
    if (!event.target.closest(".question__button")) return;

    questionStatus.textContent = "Thank you! We will contact you soon.";
    questionInput.value = "";
});
