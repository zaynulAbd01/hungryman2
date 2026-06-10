const restaurants = [
  {
    id: 1,
    name: 'City Grill',
    category: 'fast food',
    description: 'Fast delivery, tasty local favorites.',
    rating: 4.8,
    time: '30-40 mins',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Spice Route',
    category: 'local',
    description: 'Authentic Nigerian flavors delivered hot.',
    rating: 4.9,
    time: '25-35 mins',
    image: 'https://images.unsplash.com/photo-1541544180-18d792f7b9f9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Ocean Bites',
    category: 'seafood',
    description: 'Fresh seafood prepared with care.',
    rating: 4.7,
    time: '30-45 mins',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'Sushi Express',
    category: 'sushi',
    description: 'Premium rolls made to order.',
    rating: 4.9,
    time: '20-30 mins',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80'
  }
];

const foodItems = [
  {
    id: 101,
    name: 'Jollof Rice & Chicken',
    category: 'rice',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 102,
    name: 'Pizza Supreme',
    category: 'pizza',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1514516870928-51d14fd5f9d9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 103,
    name: 'Dragon Roll Sushi',
    category: 'sushi',
    price: 4100,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 104,
    name: 'Chocolate Cake',
    category: 'dessert',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1542282811-943ef1a977c7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 105,
    name: 'Iced Hibiscus Tea',
    category: 'drinks',
    price: 800,
    image: 'https://images.unsplash.com/photo-1464306076885-83f0a52c5c5b?auto=format&fit=crop&w=600&q=80'
  }
];

let cart = JSON.parse(localStorage.getItem('hungrymanCart')) || [];

const getById = (id) => document.getElementById(id);
const toast = getById('toast');

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function toggleNav() {
  const nav = getById('mainNav');
  if (!nav) return;
  nav.classList.toggle('active');
}

function renderRestaurants(search = '', category = 'all') {
  const list = getById('restaurantList');
  if (!list) return;
  const query = search.trim().toLowerCase();
  const filtered = restaurants.filter((restaurant) => {
    const matchesCategory = category === 'all' || restaurant.category === category;
    const matchesSearch = !query || restaurant.name.toLowerCase().includes(query) || restaurant.description.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  list.innerHTML = filtered.length
    ? filtered.map((restaurant) => `
      <article class="card restaurant-card">
        <img src="${restaurant.image}" alt="${restaurant.name}" />
        <div class="card-body">
          <h3>${restaurant.name}</h3>
          <p>${restaurant.description}</p>
          <div class="card-meta">
            <span>${restaurant.rating} ★</span>
            <span>${restaurant.time}</span>
          </div>
        </div>
      </article>
    `).join('')
    : '<p class="no-results">No restaurants found. Try another search.</p>';
}

function renderMenu(search = '', category = 'all') {
  const list = getById('foodList');
  if (!list) return;
  const query = search.trim().toLowerCase();
  const filtered = foodItems.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const matchesSearch = !query || item.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  list.innerHTML = filtered.length
    ? filtered.map((item) => `
      <article class="card food-card">
        <img src="${item.image}" alt="${item.name}" />
        <div class="card-body">
          <h3>${item.name}</h3>
          <p>Lorem ipsum dolor sit amet, consectetur elit.</p>
          <p class="price">₦${item.price.toLocaleString()}</p>
          <button class="button button-primary" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
      </article>
    `).join('')
    : '<p class="no-results">No food items found for this filter.</p>';
}

function updateCartStorage() {
  localStorage.setItem('hungrymanCart', JSON.stringify(cart));
}

function updateCartCount() {
  const cartCount = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount.length) {
    cartCount.forEach((el) => (el.textContent = totalItems));
  }
  const countDisplay = getById('cartCount');
  if (countDisplay) {
    countDisplay.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
  }
}

function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 500 : 0;
  const total = subtotal + deliveryFee;
  const subtotalEl = getById('cartSubtotal');
  const deliveryEl = getById('cartDelivery');
  const totalEl = getById('cartTotal');
  if (subtotalEl) subtotalEl.textContent = `₦${subtotal.toLocaleString()}`;
  if (deliveryEl) deliveryEl.textContent = `₦${deliveryFee.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `₦${total.toLocaleString()}`;
}

function renderCart() {
  const itemsContainer = getById('cartItems');
  if (!itemsContainer) return;
  if (!cart.length) {
    itemsContainer.innerHTML = '<p class="no-results">Your cart is empty. Add tasty meals to get started.</p>';
  } else {
    itemsContainer.innerHTML = cart.map((item) => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong>
          <span>₦${item.price.toLocaleString()}</span>
          <div class="quantity-controls">
            <button onclick="changeQuantity(${item.id}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="button button-secondary" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `).join('');
  }
  calculateTotals();
}

function addToCart(id) {
  const item = foodItems.find((food) => food.id === id);
  if (!item) return;
  const existing = cart.find((cartItem) => cartItem.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  updateCartStorage();
  renderCart();
  updateCartCount();
  showToast(`${item.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartStorage();
  renderCart();
  updateCartCount();
  showToast('Item removed from cart.');
}

function changeQuantity(id, delta) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity < 1) {
    removeFromCart(id);
    return;
  }
  updateCartStorage();
  renderCart();
  updateCartCount();
}

function setupTracking() {
  const button = getById('trackOrderButton');
  if (!button) return;
  button.addEventListener('click', () => {
    const orderInput = getById('orderIdInput');
    const orderId = orderInput?.value.trim();
    if (!orderId) {
      showToast('Please enter a valid Order ID.');
      return;
    }
    const steps = Array.from(document.querySelectorAll('.tracker-step'));
    const statusMap = ['received', 'preparing', 'assigned', 'way', 'delivered'];
    const progressBar = getById('orderProgressBar')?.querySelector('.progress-fill');
    const estimatedText = getById('estimatedTime');
    let currentStep = 0;
    while (currentStep < steps.length) {
      setTimeout(() => {
        steps[currentStep].classList.add('active');
        if (progressBar) progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
        const estimate = 30 + currentStep * 10;
        if (estimatedText) estimatedText.textContent = `Estimated delivery in ${estimate} minutes.`;
      }, currentStep * 900);
      currentStep += 1;
    }
    showToast(`Tracking order ${orderId}...`);
  });
}

function setupSearchForms() {
  const heroSearch = getById('heroSearch');
  const heroInput = getById('heroSearchInput');
  if (heroSearch && heroInput) {
    heroSearch.addEventListener('submit', (event) => {
      event.preventDefault();
      const query = heroInput.value.trim();
      if (!query) {
        showToast('Enter a search term to find meals and restaurants.');
        return;
      }
      window.location.href = 'restaurants.html';
      localStorage.setItem('hungrymanSearch', query);
    });
  }

  const restaurantSearch = getById('restaurantSearch');
  const restaurantCategory = getById('restaurantCategory');
  if (restaurantSearch || restaurantCategory) {
    const updateRestaurants = () => renderRestaurants(restaurantSearch?.value || '', restaurantCategory?.value || 'all');
    restaurantSearch?.addEventListener('input', updateRestaurants);
    restaurantCategory?.addEventListener('change', updateRestaurants);
    updateRestaurants();
  }

  const foodSearch = getById('foodSearch');
  const foodCategory = getById('foodCategory');
  if (foodSearch || foodCategory) {
    const updateMenu = () => renderMenu(foodSearch?.value || '', foodCategory?.value || 'all');
    foodSearch?.addEventListener('input', updateMenu);
    foodCategory?.addEventListener('change', updateMenu);
    updateMenu();
  }
}

function setupAuthForms() {
  const loginForm = getById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = getById('loginEmail').value.trim();
      const password = getById('loginPassword').value.trim();
      if (!email || !password) {
        showToast('Please provide both email and password.');
        return;
      }
      showToast('Login successful. Welcome back!');
      loginForm.reset();
    });
  }

  const signupForm = getById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = getById('fullName').value.trim();
      const email = getById('signupEmail').value.trim();
      const phone = getById('phoneNumber').value.trim();
      const password = getById('signupPassword').value.trim();
      const confirmPassword = getById('confirmPassword').value.trim();
      if (!name || !email || !phone || !password || !confirmPassword) {
        showToast('Fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.');
        return;
      }
      if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))){
        showToast('Enter a valid phone number.');
        return;
      }
      showToast('Signup complete. Account created successfully!');
      signupForm.reset();
    });
  }
}

function loadSavedSearch() {
  const search = localStorage.getItem('hungrymanSearch');
  if (!search) return;
  const restaurantSearch = getById('restaurantSearch');
  if (restaurantSearch) {
    restaurantSearch.value = search;
    renderRestaurants(search, getById('restaurantCategory')?.value || 'all');
  }
  localStorage.removeItem('hungrymanSearch');
}

function init() {
  getById('navToggle')?.addEventListener('click', toggleNav);
  document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
    getById('mainNav')?.classList.remove('active');
  }));
  renderRestaurants();
  renderMenu();
  renderCart();
  updateCartCount();
  setupSearchForms();
  setupAuthForms();
  setupTracking();
  loadSavedSearch();
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;
window.addEventListener('DOMContentLoaded', init);
