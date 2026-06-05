document.addEventListener('DOMContentLoaded', () => {

  // ── PRODUITS 
  const PRODUCTS = [
    { id:'1',  name:'Casual Jacket Femme',    price:45.99,  img:'../Produit/Photo Produit/casual.jpg',            category:'jacket',       categoryLabel:'Vestes',          sizes:['XS','S','M','L','XL'],       colors:['Blanc','Beige','Bleu ciel','Noir'],                      badge:'Nouveau',     desc:'Une veste en mélange de lin premium magnifiquement taillée, dotée de poignets travaillés et d\'un tombé naturel et fluide.' },
    { id:'2',  name:'Tenue du Sport',         price:62.50,  img:'../Produit/Photo Produit/sport.jpg',             category:'outfit',       categoryLabel:'Tenues Sport',    sizes:['XS','S','M','L','XL'],       colors:['Noir','Gris','Marine'],                                  badge:null,          desc:'Ensemble de sport sans coutures premium, conçu avec des tissus compressifs avancés à évacuation rapide de l\'humidité.' },
    { id:'3',  name:'Veste en Cuir',          price:120.00, img:'../Produit/Photo Produit/vestecuir.jpg',         category:'jacket',       categoryLabel:'Vestes',          sizes:['S','M','L','XL','XXL'],      colors:['Marron','Noir','Kaki','Beige'],                          badge:null,          desc:'Icône intemporelle de l\'attitude et du style, cette veste biker en cuir véritable noir intense.' },
    { id:'4',  name:'Chemise légere',         price:89.00,  img:'../Produit/Photo Produit/Chemise.jpg',           category:'dress',        categoryLabel:'Chemises & Tops', sizes:['XS','S','M','L'],            colors:['Sable','Blanc cassé','Terracotta'],                      badge:'Été',         desc:'Chemise coton légere, parfait pour les journées ensoleillées.' },
    { id:'5',  name:'Survettement femme',     price:74.99,  img:'../Produit/Photo Produit/sport2.jpg',            category:'outfit',       categoryLabel:'Tenue Sport',     sizes:['XS','S','M','L','XL'],       colors:['Jaune soleil','Blanc','Corail','Bleu Marine'],           badge:null,          desc:'Survettement oversize au coloris ensoleillé, alliant confort cocooning et style urbain chic.' },
    { id:'6',  name:'Chemise dentelle',       price:58.00,  img:'../Produit/Photo Produit/image2.jpg',            category:'shirt',        categoryLabel:'Chemises & Tops', sizes:['S','M','L','XL'],            colors:['Écru','Bleu marine','Vert sauge'],                       badge:null,          desc:'Top tricoté à la main aux motifs géométriques subtils.' },
    { id:'7',  name:'Cashmere Topcoat',       price:215.00, img:'../Produit/Photo Produit/Manteau2.jpg',          category:'jacket',       categoryLabel:'Vestes',          sizes:['S','M','L','XL'],            colors:['Camel','Noir','Bordeaux','Gris anthracite'],             badge:'Premium',     desc:'Manteau en cachemire pur, coupe structurée et tombé impeccable.' },
    { id:'8',  name:'Pull ',                  price:96.00,  img:'../Produit/Photo Produit/Pull.jpg',              category:'shirt',        categoryLabel:'Chemises & Tops', sizes:['S','M','L','XL','XXL'],      colors:['Écru','Marron noisette','Gris chiné','Bleu électrique'], badge:'Hiver',       desc:'Pull en laine mérinos épaisse, tressage artisanal irlandais.' },
    { id:'9',  name:'Gant pour Femme',        price:48.00,  img:'../Produit/Photo Produit/Gant.jpg',              category:'accessories',  categoryLabel:'Accessoires',     sizes:['S/M','M/L'],                 colors:['Cognac','Noir','Bordeaux'],                              badge:'Hiver',       desc:'Gant pour hiver luxueux : gants en daim doublés cachemire.' },
    { id:'10', name:'Jacket pour femme',      price:135.00, img:'../Produit/Photo Produit/Veste2.jpg',            category:'jacket',       categoryLabel:'Vestes',          sizes:['XS','S','M','L','XL'],       colors:['Noir','Crème','Bleu nuit','Kaki'],                       badge:'Nouveau',     desc:'Blazer à double boutonnage, coupe ajustée et épaules légèrement structurées.' },
    { id:'11', name:'Robe Midi Élégante',     price:88.00,  img:'../Produit/Photo Produit/Robe.jpg',              category:'dress',        categoryLabel:'Robes',           sizes:['XS','S','M','L'],            colors:['Noir','Ivoire','Sage vert','Rose poudré'],               badge:'Été',         desc:'Robe midi à taille marquée, tissu fluide qui épouse les courbes avec grâce.' },
    { id:'12', name:'Chemise Lin Premium',    price:52.00,  img:'../Produit/Photo Produit/Chemise2.jpg',          category:'shirt',        categoryLabel:'Chemises & Tops', sizes:['XS','S','M','L','XL','XXL'], colors:['Blanc','Bleu ciel','Sable','Vert olive'],                badge:'Été',         desc:'Chemise en pur lin portugais, légèrement oversize pour un tombé naturel parfait.' },
    { id:'13', name:'Ensemble Sport Luxe',    price:78.00,  img:'../Produit/Photo Produit/Sport3.jpg',            category:'outfit',       categoryLabel:'Tenues Sport',    sizes:['XS','S','M','L'],            colors:['Sauge','Terracotta','Bleu cobalt','Noir'],               badge:'Sport',       desc:'Ensemble pour sport haute performance — brassière et legging assortis.' },
    { id:'14', name:'Sac Cabas Cuir',         price:165.00, img:'../Produit/Photo Produit/Sac.jpg',               category:'accessories',  categoryLabel:'Accessoires',     sizes:['Taille unique'],             colors:['Camel','Noir','Cognac','Bordeaux'],                      badge:'Premium',     desc:'Grand cabas en cuir, coutures sellier renforcées.' },
    { id:'15', name:'Trench Coat Classique',  price:189.00, img:'../Produit/Photo Produit/Manteau3.jpg',          category:'jacket',       categoryLabel:'Vestes',          sizes:['XS','S','M','L','XL'],       colors:['Camel','Beige','Noir','Kaki'],                           badge:'Best-seller', desc:'Trench-coat emblématique en gabardine de coton traité imperméable.' },
  ];

  function normalizeImgPath(imgPath) {
    if (!imgPath) return '';
    if (imgPath.startsWith('http') || imgPath.startsWith('/')) return imgPath;
    const filename = imgPath.split('/').pop();
    return '../Produit/Photo Produit/' + filename;
  }

  const CART_KEY = 'silkroad_cart';

  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      parsed.forEach(item => {
        if (item && item.product && item.product.img) {
          item.product.img = normalizeImgPath(item.product.img);
        }
      });
      return parsed;
    } catch (e) { return []; }
  }

  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }

  // ÉTAT
  let cartItems      = loadCart();
  let wishlistItems  = new Map();
  let currentProduct = null;
  let isListView     = false;

  let activeCategory = 'all';
  let activeMaxPrice = 250;
  let activeSearch   = '';
  let activeSort     = 'default';

  // DOM 
  const productsGrid       = document.getElementById('products-grid');
  const noResults          = document.getElementById('no-results');
  const resultsCount       = document.getElementById('results-count');
  const searchInput        = document.getElementById('search-input');
  const searchClear        = document.getElementById('search-clear');
  const categoryPills      = document.getElementById('category-pills');
  const priceRange         = document.getElementById('price-range');
  const priceDisplay       = document.getElementById('price-display');
  const sortSelect         = document.getElementById('sort-select');
  const resetBtn           = document.getElementById('reset-filters');
  const resetNoResults     = document.getElementById('reset-no-results');
  const gridViewBtn        = document.getElementById('grid-view');
  const listViewBtn        = document.getElementById('list-view');
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

  // Badge initial
  cartCountBadge.innerText = cartItems.reduce((s, i) => s + i.qty, 0);

  // FILTRES
  priceRange.max   = Math.max(...PRODUCTS.map(p => p.price)) + 10;
  priceRange.value = priceRange.max;
  activeMaxPrice   = parseFloat(priceRange.max);
  priceDisplay.textContent = `$${priceRange.max}`;
  renderProducts();

  // FILTRES 
  function getFilteredProducts() {
    let list = [...PRODUCTS];
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    list = list.filter(p => p.price <= activeMaxPrice);
    if (activeSearch.trim()) {
      const q = activeSearch.trim().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }
    if (activeSort === 'price-asc')  list.sort((a, b) => a.price - b.price);
    if (activeSort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (activeSort === 'name-asc')   list.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    return list;
  }

  function renderProducts() {
    const list = getFilteredProducts();
    productsGrid.innerHTML = '';
    resultsCount.textContent = `${list.length} produit${list.length !== 1 ? 's' : ''} trouvé${list.length !== 1 ? 's' : ''}`;
    if (list.length === 0) {
      noResults.style.display    = 'flex';
      productsGrid.style.display = 'none';
      return;
    }
    noResults.style.display    = 'none';
    productsGrid.style.display = 'grid';
    list.forEach((product, index) => productsGrid.appendChild(createProductCard(product, index)));
  }

  function createProductCard(product, index) {
    const card = document.createElement('article');
    card.className  = 'product-card';
    card.dataset.id = product.id;
    card.style.animationDelay = `${index * 60}ms`;
    card.innerHTML = `
      <div class="card-visual">
        ${product.badge ? `<span class="card-badge${product.badge === 'Premium' || product.badge === 'Best-seller' ? ' sale' : ''}">${product.badge}</span>` : ''}
        <img src="${product.img}" alt="${product.name}" class="product-img"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="img-placeholder" style="display:none;"><i class="fa-solid fa-shirt"></i><span>${product.categoryLabel}</span></div>
        <button class="bookmark-btn ${wishlistItems.has(product.id) ? 'active' : ''}" aria-label="Favoris">
          <i class="fa-${wishlistItems.has(product.id) ? 'solid' : 'regular'} fa-bookmark"></i>
        </button>
      </div>
      <div class="card-info">
        <div>
          <span class="product-category">${product.categoryLabel}</span>
          <h3 class="product-title">${product.name}</h3>
        </div>
        <div class="card-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="quick-add-btn">Ajouter au panier</button>
        </div>
      </div>`;

    card.querySelector('.bookmark-btn').addEventListener('click', e => {
      e.stopPropagation();
      toggleWishlist(product, card.querySelector('.bookmark-btn'));
    });
    card.querySelector('.quick-add-btn').addEventListener('click', e => {
      e.stopPropagation();
      openProductModal(product);
    });
    card.querySelector('.card-visual').addEventListener('click', () => openProductModal(product));
    card.querySelector('.product-title').addEventListener('click', () => openProductModal(product));
    return card;
  }

  searchInput.addEventListener('input', () => {
    activeSearch = searchInput.value;
    searchClear.classList.toggle('visible', activeSearch.length > 0);
    renderProducts();
  });
  searchClear.addEventListener('click', () => {
    searchInput.value = ''; activeSearch = '';
    searchClear.classList.remove('visible');
    renderProducts(); searchInput.focus();
  });
  categoryPills.addEventListener('click', e => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    categoryPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCategory = pill.dataset.cat;
    renderProducts();
  });
  priceRange.addEventListener('input', () => {
    activeMaxPrice = parseFloat(priceRange.value);
    priceDisplay.textContent = `$${activeMaxPrice}`;
    updateRangeFill();
    renderProducts();
  });
  function updateRangeFill() {
    const pct = ((priceRange.value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
    priceRange.style.background = `linear-gradient(to right, var(--accent-brown) ${pct}%, rgba(197,168,128,0.25) ${pct}%)`;
  }
  updateRangeFill();
  sortSelect.addEventListener('change', () => { activeSort = sortSelect.value; renderProducts(); });

  function resetFilters() {
    activeCategory = 'all'; activeMaxPrice = parseFloat(priceRange.max);
    activeSearch = ''; activeSort = 'default';
    searchInput.value = ''; searchClear.classList.remove('visible');
    priceRange.value = priceRange.max;
    priceDisplay.textContent = `$${priceRange.max}`;
    updateRangeFill(); sortSelect.value = 'default';
    categoryPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    categoryPills.querySelector('[data-cat="all"]').classList.add('active');
    renderProducts(); showToast('Filtres réinitialisés', 'bag');
  }
  resetBtn.addEventListener('click', resetFilters);
  resetNoResults.addEventListener('click', resetFilters);

  gridViewBtn.addEventListener('click', () => {
    productsGrid.classList.remove('list-mode');
    gridViewBtn.classList.add('active'); listViewBtn.classList.remove('active');
  });
  listViewBtn.addEventListener('click', () => {
    productsGrid.classList.add('list-mode');
    listViewBtn.classList.add('active'); gridViewBtn.classList.remove('active');
  });

  
  function openProductModal(product) {
    currentProduct = product;
    modalImg.src         = product.img;
    modalImg.alt         = product.name;
    modalImg.onerror     = () => { modalImg.style.opacity = '0.3'; };
    modalTitle.innerText = product.name;
    modalPrice.innerText = `$${product.price.toFixed(2)}`;
    modalDesc.innerText  = product.desc;
    modalSizeLabel.textContent = product.category === 'jacket' || product.category === 'outfit' ? 'Taille (Veste/Pantalon)' : 'Taille';

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

  // PANIER
  function addToCart(product, size, color) {
    const key = `${product.id}-${size}-${color}`;
    const existing = cartItems.find(i => i.key === key);
    if (existing) {
      existing.qty++;
    } else {
      cartItems.push({
        key,
        product: {
          id:    product.id,
          name:  product.name,
          price: product.price,
          img:   normalizeImgPath(product.img)
        },
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
        <img src="${item.product.img}" alt="${item.product.name}" class="panel-item-img"
          data-fallback-idx="1"
          onerror="const fb=['../Produit/Photo Produit/'+this.getAttribute('src').split('/').pop(),'./Produit/Photo Produit/'+this.getAttribute('src').split('/').pop()];const i=parseInt(this.dataset.fallbackIdx||'0');if(i<fb.length){this.dataset.fallbackIdx=i+1;this.src=fb[i];}else{this.onerror=null;this.style.opacity='0.3';}"
        >
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
    cartPanelItems.querySelectorAll('.panel-item-remove').forEach(btn =>
      btn.addEventListener('click', () => removeFromCart(btn.dataset.key)));
  }

  // FAVORIS
  function toggleWishlist(product, btn) {
    if (wishlistItems.has(product.id)) {
      wishlistItems.delete(product.id);
      if (btn) {
        btn.classList.remove('active');
        const icon = btn.querySelector('i');
        if (icon) { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
      }
      showToast(`"${product.name}" retiré des favoris`, 'heart');
    } else {
      wishlistItems.set(product.id, product);
      if (btn) {
        btn.classList.add('active');
        const icon = btn.querySelector('i');
        if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
      }
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
        const cardBtn = document.querySelector(`.product-card[data-id="${id}"] .bookmark-btn`);
        if (cardBtn) {
          cardBtn.classList.remove('active');
          const icon = cardBtn.querySelector('i');
          if (icon) { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
        }
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


  function openPanel(panel) { panel.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closePanel(panel) { panel.classList.remove('active'); document.body.style.overflow = ''; }

  document.getElementById('cart-btn').addEventListener('click', () => { renderCartPanel(); openPanel(cartPanel); });
  document.getElementById('wishlist-btn').addEventListener('click', () => { renderWishlistPanel(); openPanel(wishlistPanel); });
  cartPanelClose.addEventListener('click', () => closePanel(cartPanel));
  wishlistPanelClose.addEventListener('click', () => closePanel(wishlistPanel));
  [cartPanel, wishlistPanel].forEach(panel =>
    panel.addEventListener('click', e => { if (!e.target.closest('.side-panel-inner')) closePanel(panel); }));

  // NAVBAR 
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

  function showToast(message, iconType = 'bag') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    const iconHtml = iconType === 'heart'
      ? '<i class="fa-solid fa-heart toast-icon"></i>'
      : '<i class="fa-solid fa-circle-check toast-icon"></i>';
    toast.innerHTML = `${iconHtml}<span class="toast-msg">${message}</span>`;
    toastWrapper.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, 2800);
  }

  function pulseBadge(badge, value) {
    badge.innerText = value;
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = 'scale(1)', 300);
  }

});