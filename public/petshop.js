import { auth } from "./firebase-config.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Datos de productos (simulación)
const products = [
    {
        id: 1,
        title: "Premium Dog Food",
        category: "alimentos",
        petType: "dog",
        description: "Alimento premium para perros con ingredientes naturales y sin conservantes artificiales.",
        price: 45.99,
        oldPrice: 59.99,
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "sale",
        stock: 15
    },
    {
        id: 2,
        title: "Collar de Cuero",
        category: "accesorios",
        petType: "dog",
        description: "Collar de cuero genuino para perros, duradero y cómodo.",
        price: 24.99,
        oldPrice: null,
        rating: 4.5,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "new",
        stock: 8
    },
    {
        id: 3,
        title: "Juguete Interactivo para Gatos",
        category: "juguetes",
        petType: "cat",
        description: "Juguete interactivo que mantiene a tu gato entretenido y activo.",
        price: 18.50,
        oldPrice: 22.99,
        rating: 4.7,
        reviews: 56,
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "sale",
        stock: 12
    },
    {
        id: 4,
        title: "Shampoo Hipoalergénico",
        category: "higiene",
        petType: "dog",
        description: "Shampoo hipoalergénico para perros con piel sensible.",
        price: 15.99,
        oldPrice: null,
        rating: 4.6,
        reviews: 42,
        image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: null,
        stock: 20
    },
    {
        id: 5,
        title: "Suplemento Vitamínico",
        category: "salud",
        petType: "cat",
        description: "Suplemento vitamínico para fortalecer el sistema inmunológico de tu gato.",
        price: 29.99,
        oldPrice: 34.99,
        rating: 4.9,
        reviews: 37,
        image: "https://images.unsplash.com/photo-1631733571640-dcbae3f99c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "sale",
        stock: 7
    },
    {
        id: 6,
        title: "Cama Ortopédica",
        category: "accesorios",
        petType: "dog",
        description: "Cama ortopédica para perros con espuma viscoelástica para mayor comodidad.",
        price: 89.99,
        oldPrice: 110.99,
        rating: 4.8,
        reviews: 65,
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "sale",
        stock: 5
    },
    {
        id: 7,
        title: "Alimento para Peces",
        category: "alimentos",
        petType: "other",
        description: "Alimento balanceado para peces tropicales de agua dulce.",
        price: 8.99,
        oldPrice: null,
        rating: 4.3,
        reviews: 28,
        image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: null,
        stock: 25
    },
    {
        id: 8,
        title: "Rascador para Gatos",
        category: "accesorios",
        petType: "cat",
        description: "Rascador de sisal con múltiples niveles y juguetes colgantes.",
        price: 65.99,
        oldPrice: 79.99,
        rating: 4.7,
        reviews: 52,
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "sale",
        stock: 10
    }
];

// Carrito de compras
let cart = [];

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Inicializar partículas
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 50,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#4CAF50"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.3,
                "random": false
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#4CAF50",
                "opacity": 0.2,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            }
        },
        "retina_detect": true
    });

    // Loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);

    // Menú móvil
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
    }

    // Botón de volver arriba
    const scrollToTopBtn = document.getElementById('scrollToTop');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    
    async function handleLogout() {
        try {
            await signOut(auth);
            alert("Sesión cerrada exitosamente.");
            window.location.href = "index.html";
        } catch (error) {
            alert("Error al cerrar sesión: " + error.message);
        }
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', handleLogout);
    }

    // Verificar si el usuario está autenticado
    auth.onAuthStateChanged(user => {
        if (!user) {
            // Si no hay usuario autenticado, redirigir al login
            window.location.href = "index.html";
        }
    });

    // Cargar productos
    loadProducts();

    // Configurar eventos para filtros y vistas
    setupFiltersAndViews();

    // Configurar eventos para el carrito
    setupCartEvents();

    // Configurar eventos para el checkout
    setupCheckoutEvents();
});

// Cargar productos en la página
function loadProducts() {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Crear tarjeta de producto
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.category = product.category;
    productCard.dataset.petType = product.petType;

    let badgeHTML = '';
    if (product.badge) {
        badgeHTML = `<span class="product-badge ${product.badge}">${product.badge === 'sale' ? 'Oferta' : 'Nuevo'}</span>`;
    }

    let oldPriceHTML = '';
    if (product.oldPrice) {
        oldPriceHTML = `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>`;
    }

    productCard.innerHTML = `
        <div class="product-image">
            ${badgeHTML}
            <img src="${product.image}" alt="${product.title}">
            <div class="product-actions">
                <button class="action-btn wishlist-btn" title="Añadir a favoritos">
                    <i class="far fa-heart"></i>
                </button>
                <button class="action-btn quick-view-btn" title="Vista rápida">
                    <i class="far fa-eye"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <span class="product-category">${getCategoryName(product.category)}</span>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${oldPriceHTML}
            </div>
            <div class="product-meta">
                <div class="product-rating">
                    ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                    ${product.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Añadir
                </button>
            </div>
        </div>
    `;

    // Añadir evento para añadir al carrito
    const addToCartBtn = productCard.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
        addToCart(product);
    });

    return productCard;
}

// Obtener nombre de categoría en español
function getCategoryName(category) {
    const categories = {
        'alimentos': 'Alimentos',
        'accesorios': 'Accesorios',
        'juguetes': 'Juguetes',
        'higiene': 'Higiene',
        'salud': 'Salud'
    };
    return categories[category] || category;
}

// Configurar filtros y vistas
function setupFiltersAndViews() {
    const petTypeFilter = document.getElementById('petTypeFilter');
    const priceFilter = document.getElementById('priceFilter');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryCards = document.querySelectorAll('.category-card');

    // Filtrar por tipo de mascota
    petTypeFilter.addEventListener('change', filterProducts);

    // Filtrar por precio
    priceFilter.addEventListener('change', filterProducts);

    // Cambiar vista a cuadrícula
    gridViewBtn.addEventListener('click', () => {
        productsContainer.className = 'products-container grid-view';
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    // Cambiar vista a lista
    listViewBtn.addEventListener('click', () => {
        productsContainer.className = 'products-container list-view';
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    // Buscar productos
    searchButton.addEventListener('click', () => {
        searchProducts(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchProducts(searchInput.value);
        }
    });

    // Filtrar por categoría
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(category);
        });
    });

    // Botón de cargar más productos
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.addEventListener('click', () => {
        // Simular carga de más productos
        loadMoreBtn.textContent = 'Cargando...';
        setTimeout(() => {
            loadMoreBtn.textContent = 'Cargar más productos';
            alert('No hay más productos disponibles en este momento.');
        }, 1500);
    });
}

// Filtrar productos
function filterProducts() {
    const petTypeFilter = document.getElementById('petTypeFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const productsContainer = document.getElementById('productsContainer');
    const productCards = productsContainer.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const product = products.find(p => p.id === parseInt(card.querySelector('.add-to-cart').dataset.id));
        let showCard = true;

        // Filtrar por tipo de mascota
        if (petTypeFilter !== 'all' && product.petType !== petTypeFilter) {
            showCard = false;
        }

        // Filtrar por precio
        if (priceFilter !== 'all') {
            const sortedProducts = [...products].sort((a, b) => {
                if (priceFilter === 'low') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
            
            const index = sortedProducts.findIndex(p => p.id === product.id);
            if (index > 3) { // Mostrar solo los primeros 4 productos según el filtro de precio
                showCard = false;
            }
        }

        card.style.display = showCard ? 'flex' : 'none';
    });
}

// Buscar productos
function searchProducts(query) {
    query = query.toLowerCase().trim();
    const productsContainer = document.getElementById('productsContainer');
    const productCards = productsContainer.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const description = card.querySelector('.product-description').textContent.toLowerCase();
        const category = card.dataset.category.toLowerCase();

        if (title.includes(query) || description.includes(query) || category.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filtrar por categoría
function filterByCategory(category) {
    const productsContainer = document.getElementById('productsContainer');
    const productCards = productsContainer.querySelectorAll('.product-card');

    productCards.forEach(card => {
        if (card.dataset.category === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Configurar eventos para el carrito
function setupCartEvents() {
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    const cartContainer = document.getElementById('cartContainer');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Abrir carrito
    floatingCartBtn.addEventListener('click', () => {
        cartContainer.classList.add('active');
        cartOverlay.classList.add('active');
    });

    // Cerrar carrito
    closeCartBtn.addEventListener('click', () => {
        cartContainer.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    cartOverlay.addEventListener('click', () => {
        cartContainer.classList.remove('active');
        cartOverlay.classList.remove('active');
    });

    // Proceder al checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío. Añade productos antes de continuar.');
            return;
        }
        openCheckoutModal();
    });
}

// Añadir producto al carrito
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    
    // Mostrar notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>Producto añadido al carrito</p>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 100);
}

// Actualizar interfaz del carrito
function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Actualizar contador del carrito
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Actualizar total del carrito
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Actualizar items del carrito
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Añadir eventos a los botones de cantidad
    const minusButtons = cartItems.querySelectorAll('.minus');
    const plusButtons = cartItems.querySelectorAll('.plus');
    const removeButtons = cartItems.querySelectorAll('.cart-item-remove');
    
    minusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            decreaseQuantity(id);
        });
    });
    
    plusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            increaseQuantity(id);
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.dataset.id);
            removeFromCart(id);
        });
    });
    
    // Actualizar también el resumen del checkout si está abierto
    updateCheckoutSummary();
}

// Aumentar cantidad de un producto en el carrito
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        updateCartUI();
    }
}

// Disminuir cantidad de un producto en el carrito
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

// Eliminar un producto del carrito
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Configurar eventos para el checkout
function setupCheckoutEvents() {
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
    const paymentMethod = document.getElementById('paymentMethod');
    const cardDetails = document.getElementById('cardDetails');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const orderCompletedModal = document.getElementById('orderCompletedModal');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');

    // Mostrar/ocultar detalles de tarjeta según el método de pago
    paymentMethod.addEventListener('change', () => {
        if (paymentMethod.value === 'creditCard' || paymentMethod.value === 'debitCard') {
            cardDetails.classList.add('active');
        } else {
            cardDetails.classList.remove('active');
        }
    });

    // Cerrar modal de checkout
    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        checkoutOverlay.classList.remove('active');
    });

    checkoutOverlay.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        checkoutOverlay.classList.remove('active');
    });

    // Realizar pedido
    placeOrderBtn.addEventListener('click', () => {
        // Validar formulario
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zipCode = document.getElementById('zipCode').value;
        const selectedPayment = paymentMethod.value;
        
        if (!fullName || !email || !address || !city || !zipCode || !selectedPayment) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }
        
        if ((selectedPayment === 'creditCard' || selectedPayment === 'debitCard')) {
            const cardNumber = document.getElementById('cardNumber').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            
            if (!cardNumber || !expiryDate || !cvv) {
                alert('Por favor completa los detalles de la tarjeta.');
                return;
            }
        }
        
        // Procesar pedido
        checkoutModal.classList.remove('active');
        
        // Generar número de pedido aleatorio
        const orderNumber = Math.floor(100000 + Math.random() * 900000);
        document.getElementById('orderNumber').textContent = orderNumber;
        
        // Mostrar modal de pedido completado
        orderCompletedModal.classList.add('active');
        
        // Vaciar carrito
        cart = [];
        updateCartUI();
    });

    // Continuar comprando
    continueShoppingBtn.addEventListener('click', () => {
        orderCompletedModal.classList.remove('active');
        checkoutOverlay.classList.remove('active');
    });
}

// Abrir modal de checkout
function openCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutOverlay = document.getElementById('checkoutOverlay');
    const cartContainer = document.getElementById('cartContainer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    // Cerrar carrito
    cartContainer.classList.remove('active');
    cartOverlay.classList.remove('active');
    
    // Actualizar resumen de checkout
    updateCheckoutSummary();
    
    // Abrir modal de checkout
    checkoutModal.classList.add('active');
    checkoutOverlay.classList.add('active');
}

// Actualizar resumen de checkout
function updateCheckoutSummary() {
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutShipping = document.getElementById('checkoutShipping');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    if (!checkoutSubtotal) return;
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 5 : 0;
    const total = subtotal + shipping;
    
    checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    checkoutShipping.textContent = `$${shipping.toFixed(2)}`;
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}
