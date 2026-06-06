const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const productList = document.querySelector(".products__list");
const productCards = document.querySelectorAll(".product-card");
const productFilters = document.querySelectorAll(".product-filter");
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
const checkoutForm = document.querySelector(".checkout-form");
const closeCartButtons = document.querySelectorAll("[data-close-cart]");
const favoriteCount = document.querySelector(".favorite-counter__count");
const quickView = document.querySelector(".quick-view");
const quickImage = document.querySelector(".quick-view__image");
const quickBadge = document.querySelector(".quick-view__badge");
const quickTitle = document.querySelector(".quick-view__title");
const quickText = document.querySelector(".quick-view__text");
const quickScore = document.querySelector(".quick-view__score");
const quickVotes = document.querySelector(".quick-view__votes");
const quickCalories = document.querySelector(".quick-view__calories");
const quickSize = document.querySelector(".quick-view__size");
const quickReviews = document.querySelector(".quick-view__reviews");
const quickRelatedList = document.querySelector(".quick-view__related-list");
const quickBuy = document.querySelector(".quick-view__buy");
const closeQuickButtons = document.querySelectorAll("[data-close-quick]");
const questionForm = document.querySelector(".question__form");
const questionInput = document.querySelector(".question__input");
const questionStatus = document.querySelector(".question__status");

const cart = [];
const favorites = new Set();
const deliveryPrice = 4.99;
const productReviews = {
    "Pistachio Dream": {
        rating: "4.9",
        votes: "214 reviews",
        reviews: [
            ["Creamy, nutty, and very smooth. This one tastes like the premium option.", "Anna K."],
            ["The roasted pistachio note is exactly right, not too sweet.", "Daniel R."],
        ],
    },
    "Berry Cream": {
        rating: "4.8",
        votes: "167 reviews",
        reviews: [
            ["Fresh berry flavor, soft texture, and a really clean finish.", "Mila S."],
            ["Feels light but still rich enough for dessert night.", "Nora V."],
        ],
    },
    "Vanilla Black": {
        rating: "4.7",
        votes: "132 reviews",
        reviews: [
            ["Classic vanilla, but the darker finish makes it feel more grown-up.", "Leo M."],
            ["Simple, smooth, and the cup looks beautiful.", "Kate D."],
        ],
    },
    "Strawberry Milk": {
        rating: "4.8",
        votes: "188 reviews",
        reviews: [
            ["The strawberry tastes soft and natural, not candy-like.", "Sofia L."],
            ["My favorite for summer. Gentle and creamy.", "Alex P."],
        ],
    },
    "Classic Mint": {
        rating: "4.6",
        votes: "119 reviews",
        reviews: [
            ["Cold, crisp, and super refreshing after dinner.", "Mark D."],
            ["Mint is balanced well. No toothpaste vibe.", "Ira N."],
        ],
    },
    "Chocolate Noir": {
        rating: "4.9",
        votes: "241 reviews",
        reviews: [
            ["Dark chocolate flavor is deep and expensive-feeling.", "Chris B."],
            ["Best one with coffee. Rich but not heavy.", "Emma T."],
        ],
    },
    "Mango Silk": {
        rating: "4.7",
        votes: "146 reviews",
        reviews: [
            ["Bright mango, very smooth texture, perfect for a warm day.", "Vlad K."],
            ["Tastes tropical without being too sweet.", "Lena F."],
        ],
    },
    "Blueberry Frost": {
        rating: "4.8",
        votes: "173 reviews",
        reviews: [
            ["Blueberry is fresh and the finish is really clean.", "Omar H."],
            ["The color and taste both feel premium.", "Dina C."],
        ],
    },
    "Caramel Gold": {
        rating: "4.9",
        votes: "203 reviews",
        reviews: [
            ["Caramel ribbons are rich and smooth, a proper treat.", "Max N."],
            ["Sweet, but in a polished way. Very dessert-like.", "Alina W."],
        ],
    },
    "Coconut Snow": {
        rating: "4.7",
        votes: "151 reviews",
        reviews: [
            ["Light coconut and creamy texture. Really clean flavor.", "Nick A."],
            ["Feels like a winter flavor but still fresh.", "Tanya B."],
        ],
    },
};

const formatPrice = (value) => `$${value.toFixed(2)}`;
const parsePrice = (price) => Number(String(price).replace("$", "")) || 0;

const setMenuState = (isOpen) => {
    nav?.classList.toggle("is-open", isOpen);
    menuToggle?.classList.toggle("is-active", isOpen);
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
};

const setPageLock = () => {
    const hasOverlay =
        modal?.classList.contains("is-open") ||
        cartDrawer?.classList.contains("is-open") ||
        quickView?.classList.contains("is-open");
    document.body.classList.toggle("modal-open", Boolean(hasOverlay));
};

const refreshFavoriteCount = () => {
    if (favoriteCount) {
        favoriteCount.textContent = String(favorites.size);
    }
};

const decorateProductCards = () => {
    productCards.forEach((card) => {
        const image = card.querySelector(".product-card__image");
        const button = card.querySelector(".product-card__button");

        if (image && !card.querySelector(".product-card__media")) {
            const media = document.createElement("div");
            media.className = "product-card__media";
            image.before(media);
            media.append(image);

            const badge = document.createElement("span");
            badge.className = "product-card__badge";
            badge.textContent = card.dataset.badge || "New";
            media.append(badge);

            const favoriteButton = document.createElement("button");
            favoriteButton.className = "product-card__favorite";
            favoriteButton.type = "button";
            favoriteButton.dataset.favorite = card.dataset.name;
            favoriteButton.setAttribute("aria-label", `Add ${card.dataset.name} to favorites`);
            favoriteButton.textContent = "+";
            media.append(favoriteButton);
        }

        if (button && !card.querySelector(".product-card__quick")) {
            const quickButton = document.createElement("button");
            quickButton.className = "product-card__quick";
            quickButton.type = "button";
            quickButton.dataset.quickView = card.dataset.name;
            quickButton.textContent = "Quick View";
            button.after(quickButton);
        }
    });
};

const getProductData = (card) => ({
    name: card.dataset.name,
    price: card.dataset.price,
    badge: card.dataset.badge,
    details: card.dataset.details,
    calories: card.dataset.calories,
    size: card.dataset.size,
    category: card.dataset.category,
    image: card.querySelector(".product-card__image")?.getAttribute("src"),
});

const getRelatedProducts = (currentCard) => {
    const currentCategories = (currentCard.dataset.category || "").split(" ");
    const cards = Array.from(productCards).filter((card) => card !== currentCard);

    return cards
        .map((card) => ({
            card,
            score: (card.dataset.category || "")
                .split(" ")
                .filter((category) => currentCategories.includes(category)).length,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((item) => item.card);
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

const openQuickView = (card) => {
    if (!quickView || !card) return;

    const product = getProductData(card);
    const reviewData = productReviews[product.name] || productReviews["Pistachio Dream"];
    quickImage.src = product.image;
    quickImage.alt = `${product.name} ice cream`;
    quickBadge.textContent = product.badge;
    quickTitle.textContent = product.name;
    quickText.textContent = product.details;
    quickScore.textContent = reviewData.rating;
    quickVotes.textContent = reviewData.votes;
    quickCalories.textContent = product.calories;
    quickSize.textContent = product.size;
    quickBuy.dataset.name = product.name;
    quickBuy.dataset.price = product.price;
    quickReviews.innerHTML = reviewData.reviews.map(([text, author]) => `
        <article class="quick-review">
            <p>${text}</p>
            <strong>${author}</strong>
        </article>
    `).join("");
    quickRelatedList.innerHTML = getRelatedProducts(card).map((relatedCard) => {
        const related = getProductData(relatedCard);

        return `
            <button class="related-card" type="button" data-related="${related.name}">
                <img src="${related.image}" alt="${related.name} ice cream">
                <strong>${related.name}</strong>
                <span>${related.price}</span>
            </button>
        `;
    }).join("");

    quickView.classList.add("is-open");
    quickView.setAttribute("aria-hidden", "false");
    setPageLock();
};

const closeQuickView = () => {
    if (!quickView) return;

    quickView.classList.remove("is-open");
    quickView.setAttribute("aria-hidden", "true");
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

decorateProductCards();
refreshFavoriteCount();

productFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
        const activeFilter = filter.dataset.filter;

        productFilters.forEach((button) => {
            button.classList.toggle("is-active", button === filter);
        });

        productCards.forEach((card) => {
            const categories = card.dataset.category || "";
            const shouldShow = activeFilter === "all" || categories.split(" ").includes(activeFilter);
            card.classList.toggle("is-hidden", !shouldShow);
        });

        productList?.scrollTo({ left: 0, behavior: "smooth" });
    });
});

productArrows.forEach((arrow, index) => {
    arrow.addEventListener("click", () => {
        if (!productList) return;

        const card = productList.querySelector(".product-card");
        const cardWidth = card ? card.getBoundingClientRect().width + 20 : 270;
        const maxScroll = productList.scrollWidth - productList.clientWidth;
        const isPrevious = index === 0;
        const isAtStart = productList.scrollLeft <= 2;
        const isAtEnd = productList.scrollLeft >= maxScroll - 2;
        let nextScroll = productList.scrollLeft + (isPrevious ? -cardWidth : cardWidth);

        if (isPrevious && isAtStart) {
            nextScroll = maxScroll;
        }

        if (!isPrevious && isAtEnd) {
            nextScroll = 0;
        }

        productList.scrollTo({
            left: nextScroll,
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

productList?.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite]");
    const quickButton = event.target.closest("[data-quick-view]");
    const blockedClick = event.target.closest("button");
    const card = event.target.closest(".product-card");

    if (favoriteButton) {
        const name = favoriteButton.dataset.favorite;
        const isFavorite = favorites.has(name);

        if (isFavorite) {
            favorites.delete(name);
        } else {
            favorites.add(name);
        }

        favoriteButton.classList.toggle("is-active", !isFavorite);
        favoriteButton.textContent = isFavorite ? "+" : "OK";
        favoriteButton.setAttribute(
            "aria-label",
            `${isFavorite ? "Add" : "Remove"} ${name} ${isFavorite ? "to" : "from"} favorites`
        );
        refreshFavoriteCount();
        return;
    }

    if (quickButton) {
        openQuickView(quickButton.closest(".product-card"));
        return;
    }

    if (card && !blockedClick) {
        openQuickView(card);
    }
});

closeModalButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
});

closeQuickButtons.forEach((button) => {
    button.addEventListener("click", closeQuickView);
});

quickBuy?.addEventListener("click", () => {
    closeQuickView();
    openModal({
        name: quickBuy.dataset.name,
        price: quickBuy.dataset.price,
    });
});

quickRelatedList?.addEventListener("click", (event) => {
    const relatedButton = event.target.closest("[data-related]");
    if (!relatedButton) return;

    const card = Array.from(productCards).find((productCard) => productCard.dataset.name === relatedButton.dataset.related);
    openQuickView(card);
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
        closeQuickView();
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

    const fields = Array.from(checkoutForm?.querySelectorAll("input, select") || []);
    const isComplete = fields.every((field) => field.value.trim());

    if (!isComplete) {
        cartStatus.textContent = "Please fill in your name, phone, address, and delivery method.";
        return;
    }

    const formData = new FormData(checkoutForm);
    cartStatus.textContent = `Order created for ${formData.get("name")} via ${formData.get("delivery")}. We will prepare cold delivery.`;
});

questionForm?.addEventListener("click", (event) => {
    if (!event.target.closest(".question__button")) return;

    questionStatus.textContent = "Thank you! We will contact you soon.";
    questionInput.value = "";
});

const revealElements = document.querySelectorAll("main > section, .product-card, .footer");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
}

renderCart();
