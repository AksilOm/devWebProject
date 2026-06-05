document.addEventListener('DOMContentLoaded', () => {

  // PRODUITS
  const PRODUCTS = [
    {
      id: '1',
      name: 'Casual jacket femme',
      price: 45.99,
      img: 'images accueil/casual.jpg',
      desc: 'Une veste en mélange de lin premium magnifiquement taillée, dotée de poignets travaillés et d\'un tombé naturel et fluide.',
      type: 'shirt',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blanc', 'Beige', 'Bleu ciel', 'Noir']
    },
    {
      id: '2',
      name: 'Tenue du sport',
      price: 62.50,
      img: 'images accueil/sport.jpg',
      desc: 'Ensemble de sport sans coutures premium, conçu avec des tissus compressifs avancés à évacuation rapide de l\'humidité.',
      type: 'outfit',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Noir', 'Gris', 'Marine']
    },
    {
      id: '3',
      name: 'Veste en cuir',
      price: 120.00,
      img: 'images accueil/vestecuir.jpg',
      desc: 'Icône intemporelle de l\'attitude et du style, cette veste biker en cuir véritable noir intense.',
      type: 'jacket',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Marron', 'Noir', 'Kaki', 'Beige']
    }
  ];

  const CART_KEY = 'silkroad_cart';

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  }

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }

  // ÉTAT 
  let cartItems     = loadCart();
  let wishlistItems = new Map();
  let currentProduct = null;

  // DOM 
  const cartCountBadge     = document.getElementById('cart-count');
  const wishlistCountBadge = document.getElementById('wishlist-count');
  const productModal       = document.getElementById('product-modal');
  const modalCloseBtn      = document.getElementById('modal-close');
  const modalImg           = document.getElementById('modal-product-img');
  const modalTitle         = document.getElementById('modal-product-title');
  const modalPrice         = document.getElementById('modal-product-price');
  const modalDesc          = document.getElementById('modal-product-desc');
  const modalAddBtn        = document.getElementById('modal-add-to-cart');
  const modalSaveBtn       = document.getElementById('modal-save-wishlist');
  const modalSizeGroup     = document.getElementById('modal-size-group');
  const modalColorGroup    = document.getElementById('modal-color-group');
  const modalSizeLabel     = document.getElementById('modal-size-label');
  const cartPanel          = document.getElementById('cart-panel');
  const cartPanelClose     = document.getElementById('cart-panel-close');
  const cartPanelItems     = document.getElementById('cart-panel-items');
  const cartPanelTotal     = document.getElementById('cart-panel-total');
  const cartEmptyMsg       = document.getElementById('cart-empty-msg');
  const wishlistPanel      = document.getElementById('wishlist-panel');
  const wishlistPanelClose = document.getElementById('wishlist-panel-close');
  const wishlistPanelItems = document.getElementById('wishlist-panel-items');
  const wishlistEmptyMsg   = document.getElementById('wishlist-empty-msg');
  const toastWrapper       = document.getElementById('toast-wrapper');
  const navbar             = document.getElementById('site-header');

  updateCartBadge();

  // BADGE
  function updateCartBadge() {
    cartCountBadge.innerText = cartItems.reduce((s, i) => s + i.qty, 0);
  }

  function pulseBadge(badge, value) {
    badge.innerText = value;
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = 'scale(1)', 300);
  }

  function showToast(message, iconType = 'bag') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = iconType === 'heart'
      ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>`
      : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    toast.innerHTML = `${icon}<span class="toast-msg">${message}</span>`;
    toastWrapper.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      toast.addEventListener('animationend', () => toast.remove());
    }, 2600);
  }

  // PANIER
  function addToCart(product, size, color) {
    const key = `${product.id}-${size}-${color}`;
    const existing = cartItems.find(i => i.key === key);
    if (existing) {
      existing.qty++;
    } else {
      cartItems.push({
        key,
        product: { id: product.id, name: product.name, price: product.price, img: product.img },
        size,
        color,
        qty: 1
      });
    }
    saveCart();
    pulseBadge(cartCountBadge, cartItems.reduce((s, i) => s + i.qty, 0));
    showToast(`"${product.name}" ajouté au panier !`, 'bag');
    renderCartPanel();
  }

  function removeFromCart(key) {
    cartItems = cartItems.filter(i => i.key !== key);
    saveCart();
    pulseBadge(cartCountBadge, cartItems.reduce((s, i) => s + i.qty, 0));
    renderCartPanel();
  }

  function renderCartPanel() {
    cartPanelItems.innerHTML = '';
    if (cartItems.length === 0) {
      cartEmptyMsg.style.display = 'flex';
      cartPanelTotal.textContent = 'Total : $0.00';
      return;
    }
    cartEmptyMsg.style.display = 'none';
    cartItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'panel-item';
      div.innerHTML = `
        <img src="${item.product.img}" alt="${item.product.name}" class="panel-item-img" onerror="this.style.opacity='0.3'">
        <div class="panel-item-info">
          <span class="panel-item-name">${item.product.name}</span>
          <span class="panel-item-meta">Taille : ${item.size} | Couleur : ${item.color}</span>
          <span class="panel-item-meta">Qté : ${item.qty} × $${item.product.price.toFixed(2)}</span>
          <span class="panel-item-subtotal">$${(item.product.price * item.qty).toFixed(2)}</span>
        </div>
        <button class="panel-item-remove" data-key="${item.key}" aria-label="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>`;
      cartPanelItems.appendChild(div);
    });
    const total = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
    cartPanelTotal.textContent = `Total : $${total.toFixed(2)}`;
    cartPanelItems.querySelectorAll('.panel-item-remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(btn.dataset.key));
    });
  }

  // FAVORIS
  function toggleWishlist(product, btn) {
    if (wishlistItems.has(product.id)) {
      wishlistItems.delete(product.id);
      if (btn) btn.classList.remove('active');
      showToast(`"${product.name}" retiré des favoris`, 'heart');
    } else {
      wishlistItems.set(product.id, product);
      if (btn) btn.classList.add('active');
      showToast(`"${product.name}" ajouté aux favoris !`, 'heart');
    }
    pulseBadge(wishlistCountBadge, wishlistItems.size);
    renderWishlistPanel();
  }

  function renderWishlistPanel() {
    wishlistPanelItems.innerHTML = '';
    if (wishlistItems.size === 0) { wishlistEmptyMsg.style.display = 'flex'; return; }
    wishlistEmptyMsg.style.display = 'none';
    wishlistItems.forEach(product => {
      const div = document.createElement('div');
      div.className = 'panel-item';
      div.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="panel-item-img" onerror="this.style.opacity='0.3'">
        <div class="panel-item-info">
          <span class="panel-item-name">${product.name}</span>
          <span class="panel-item-price">$${product.price.toFixed(2)}</span>
          <button class="wishlist-add-cart-btn" data-id="${product.id}">Ajouter au panier</button>
        </div>
        <button class="panel-item-remove" data-id="${product.id}" aria-label="Supprimer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>`;
      wishlistPanelItems.appendChild(div);
    });
    wishlistPanelItems.querySelectorAll('.panel-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const product = wishlistItems.get(id);
        wishlistItems.delete(id);
        document.querySelector(`.product-card[data-id="${id}"] .bookmark-btn`)?.classList.remove('active');
        pulseBadge(wishlistCountBadge, wishlistItems.size);
        renderWishlistPanel();
        if (product) showToast(`"${product.name}" retiré des favoris`, 'heart');
      });
    });
    wishlistPanelItems.querySelectorAll('.wishlist-add-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = wishlistItems.get(btn.dataset.id);
        if (product) { closePanel(wishlistPanel); openProductModal(product); }
      });
    });
  }

  function openProductModal(product) {
    currentProduct = product;
    modalImg.src         = product.img;
    modalImg.alt         = product.name;
    modalTitle.innerText = product.name;
    modalPrice.innerText = `$${product.price.toFixed(2)}`;
    modalDesc.innerText  = product.desc;
    modalSizeLabel.textContent = product.type === 'jacket' || product.type === 'outfit' ? 'Taille (Veste/Pantalon)' : 'Taille';

    modalSizeGroup.innerHTML = product.sizes.map((s, i) =>
      `<button class="size-btn${i === 0 ? ' active' : ''}" data-val="${s}">${s}</button>`).join('');
    modalColorGroup.innerHTML = product.colors.map((c, i) =>
      `<button class="color-btn${i === 0 ? ' active' : ''}" data-val="${c}">${c}</button>`).join('');

    modalSizeGroup.querySelectorAll('.size-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        modalSizeGroup.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }));
    modalColorGroup.querySelectorAll('.color-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        modalColorGroup.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }));

    if (wishlistItems.has(product.id)) {
      modalSaveBtn.classList.add('active');
      modalSaveBtn.querySelector('.save-btn-text').textContent = 'Retirer des favoris';
    } else {
      modalSaveBtn.classList.remove('active');
      modalSaveBtn.querySelector('.save-btn-text').textContent = 'Sauvegarder';
    }
    modalSaveBtn.style.display = 'flex';

    productModal.classList.add('active');
    productModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    productModal.classList.remove('active');
    productModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentProduct = null;
  }

  modalCloseBtn.addEventListener('click', closeProductModal);
  productModal.addEventListener('click', e => { if (e.target === productModal) closeProductModal(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && productModal.classList.contains('active')) closeProductModal(); });

  modalAddBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    const size  = modalSizeGroup.querySelector('.size-btn.active')?.dataset.val  || currentProduct.sizes[0];
    const color = modalColorGroup.querySelector('.color-btn.active')?.dataset.val || currentProduct.colors[0];
    addToCart(currentProduct, size, color);
    closeProductModal();
  });

  modalSaveBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    const bookmarkBtn = document.querySelector(`.product-card[data-id="${currentProduct.id}"] .bookmark-btn`);
    toggleWishlist(currentProduct, bookmarkBtn);
    if (wishlistItems.has(currentProduct.id)) {
      modalSaveBtn.classList.add('active');
      modalSaveBtn.querySelector('.save-btn-text').textContent = 'Retirer des favoris';
    } else {
      modalSaveBtn.classList.remove('active');
      modalSaveBtn.querySelector('.save-btn-text').textContent = 'Sauvegarder';
    }
  });

  function openPanel(panel) { panel.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closePanel(panel) { panel.classList.remove('active'); document.body.style.overflow = ''; }

  document.getElementById('cart-btn').addEventListener('click', () => { renderCartPanel(); openPanel(cartPanel); });
  document.getElementById('wishlist-btn').addEventListener('click', () => { renderWishlistPanel(); openPanel(wishlistPanel); });
  cartPanelClose.addEventListener('click', () => closePanel(cartPanel));
  wishlistPanelClose.addEventListener('click', () => closePanel(wishlistPanel));
  [cartPanel, wishlistPanel].forEach(panel =>
    panel.addEventListener('click', e => { if (!e.target.closest('.side-panel-inner')) closePanel(panel); }));

  document.querySelector('.products-grid').addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    const product = PRODUCTS.find(p => p.id === card.getAttribute('data-id'));
    if (!product) return;

    if (e.target.closest('.bookmark-btn')) {
      e.stopPropagation();
      toggleWishlist(product, e.target.closest('.bookmark-btn'));
      return;
    }
    if (e.target.closest('.quick-add-btn')) {
      e.stopPropagation();
      openProductModal(product);
      return;
    }
    openProductModal(product);
  });

  // NAVBAR
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

  document.querySelectorAll('.nav-item').forEach(item =>
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    }));

  document.getElementById('view-all-trending')?.addEventListener('click', () => {
    window.location.href = '../Produit/Produit.html';
  });

  ['explore-summer', 'explore-winter'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () =>
      showToast(`Ouverture du lookbook...`, 'bag'));
  });

});