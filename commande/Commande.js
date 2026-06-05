// CLÉS POSSIBLES 
const POSSIBLE_KEYS = ['silkroad_cart', 'cart', 'panier', 'silk_cart'];

// RÉSOLUTION DES CHEMINS D'IMAGES
function getImgFallbacks(imgPath) {
  if (!imgPath) return [];
  if (imgPath.startsWith('http') || imgPath.startsWith('/')) return [imgPath];

  const filename = imgPath.split('/').pop(); 
  return [
    imgPath,                                          
    '../Produit/Photo Produit/' + filename,          
    './Produit/Photo Produit/' + filename,         
    '../Photo Produit/' + filename,                   
  ];
}
window.tryNextImgFallback = function(imgEl, imgPath) {
  const fallbacks = getImgFallbacks(imgPath);
  const idx = parseInt(imgEl.dataset.fallbackIdx || '0', 10);
  if (idx < fallbacks.length) {
    imgEl.dataset.fallbackIdx = idx + 1;
    imgEl.src = fallbacks[idx];
  } else {
    imgEl.removeAttribute('src');
    imgEl.style.background = 'var(--accent-pink, #f0e0d0)';
    imgEl.style.minWidth   = '62px';
    imgEl.onerror          = null;
  }
};

function resolveImg(imgPath) {
  const list = getImgFallbacks(imgPath);
  return list.length > 0 ? list[0] : '';
}

function readCartFromStorage() {

  console.group('[Cart] 🔍 Diagnostic complet du localStorage');
  console.log(`Nombre total de clés dans localStorage : ${localStorage.length}`);
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    const raw = localStorage.getItem(k);
    const isKnown = POSSIBLE_KEYS.includes(k);
    try {
      const parsed = JSON.parse(raw);
      console.log(
        `%c Clé "${k}" %c${isKnown ? '✓ connue' : '⚠ INCONNUE de POSSIBLE_KEYS'}`,
        'background:#333;color:#fff;padding:1px 4px;border-radius:2px',
        isKnown ? 'color:green;font-weight:bold' : 'color:orange;font-weight:bold',
        '→ valeur :', parsed
      );
    } catch (e) {
      console.warn(`  Clé "${k}" contient une valeur non-JSON :`, raw);
    }
  }
  if (localStorage.length === 0) {
    console.warn('  localStorage est vide !');
  }
  console.groupEnd();

  for (const key of POSSIBLE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        console.log(`[Cart] Clé "${key}" absente ou vide`);
        continue;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`[Cart] ✓ Panier trouvé dans localStorage["${key}"] :`, parsed);
        return parsed;
      } else {
        console.warn(`[Cart] Clé "${key}" existe mais contient :`, parsed, '(pas un tableau non-vide)');
      }
    } catch (e) {
      console.warn(`[Cart] Erreur de lecture pour la clé "${key}"`, e);
    }
  }

  console.warn('[Cart] ✗ Aucune clé connue ne contient un panier valide.');
  return null;
}

function normalizeItem(item) {

  // Format A – { product: { name, price, img }, size, color, qty }
  if (item && item.product && item.product.name && item.product.price != null) {
    console.log(`[Cart] Normalisation Format A : "${item.product.name}"`);
    return {
      key:     item.key || `${item.product.id || item.product.name}-${item.size || ''}-${item.color || ''}`,
      product: {
        id:    item.product.id    || '',
        name:  item.product.name,
        price: parseFloat(item.product.price) || 0,
        img:   item.product.img   || item.product.image || ''
      },
      size:  item.size  || item.taille   || '',
      color: item.color || item.couleur  || '',
      qty:   parseInt(item.qty || item.quantity || item.quantite || 1, 10)
    };
  }

  if (item && item.name && item.price != null) {
    console.log(`[Cart] Normalisation Format B : "${item.name}"`);
    return {
      key:     item.key || `${item.id || item.name}-${item.size || ''}-${item.color || ''}`,
      product: {
        id:    item.id    || '',
        name:  item.name,
        price: parseFloat(item.price) || 0,
        img:   item.img || item.image || ''
      },
      size:  item.size  || item.taille   || '',
      color: item.color || item.couleur  || '',
      qty:   parseInt(item.qty || item.quantity || item.quantite || 1, 10)
    };
  }

  if (item && (item.titre || item.title) && (item.prix || item.price) != null) {
    console.log(`[Cart] Normalisation Format C : "${item.titre || item.title}"`);
    return {
      key:     item.key || `${item.id || ''}-${item.size || ''}`,
      product: {
        id:    item.id || '',
        name:  item.titre || item.title,
        price: parseFloat(item.prix || item.price) || 0,
        img:   item.image || item.img || item.photo || ''
      },
      size:  item.size  || item.taille   || '',
      color: item.color || item.couleur  || '',
      qty:   parseInt(item.qty || item.quantity || item.quantite || 1, 10)
    };
  }

  console.warn('[Cart] ✗ Article ignoré — format non reconnu. Contenu brut :', item);
  console.warn('[Cart]   Propriétés disponibles :', Object.keys(item || {}));
  return null;
}

function mergeduplicates(items) {
  const map = new Map();
  for (const item of items) {
    if (map.has(item.key)) {
      console.log(`[Cart] Fusion doublon : clé "${item.key}" — quantité cumulée`);
      map.get(item.key).qty += item.qty;
    } else {
      map.set(item.key, { ...item });
    }
  }
  return Array.from(map.values());
}

console.group('[Cart] === Chargement du panier ===');

let rawItems = readCartFromStorage();
let cartItems = [];

console.log('[Cart] rawItems bruts lus depuis localStorage :', rawItems);

if (rawItems && rawItems.length > 0) {
  console.log(`[Cart] Normalisation de ${rawItems.length} article(s)...`);
  const normalized = rawItems.map(normalizeItem).filter(Boolean);
  console.log(`[Cart] Après normalisation : ${normalized.length}/${rawItems.length} articles valides`, normalized);
  cartItems = mergeduplicates(normalized);
  console.log(`[Cart] Après fusion doublons : ${cartItems.length} article(s)`, cartItems);

  if (cartItems.length === 0) {
    console.error('[Cart] ✗ Normalisation a tout rejeté — panier vide affiché');
  } else {
    console.log(`[Cart] ✓ ${cartItems.length} article(s) chargés depuis localStorage`);
  }
} else {
  console.warn('[Cart] ✗ Aucun panier trouvé dans localStorage — panier vide affiché');
}

console.log('[Cart] Articles finaux chargés :', cartItems);
console.groupEnd();

const SHIPPING_THRESHOLD = 200;
const SHIPPING_COST      = 9.99;

function getSubtotal()    { return cartItems.reduce((s, i) => s + i.product.price * i.qty, 0); }
function isFreeShipping() { return getSubtotal() >= SHIPPING_THRESHOLD; }
function getTotal()       { return getSubtotal() + (isFreeShipping() ? 0 : SHIPPING_COST); }

function renderSummary() {
  const container = document.getElementById('summary-items');

  if (cartItems.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px 0;">Votre panier est vide.</p>';
  } else {
    container.innerHTML = cartItems.map(item => {
      const imgSrc     = resolveImg(item.product.img);
      const imgPathAttr = item.product.img.replace(/"/g, '&quot;');
      return `
        <div class="summary-item">
          <div class="item-img-wrap">
            <img
              src="${imgSrc}"
              alt="${item.product.name}"
              class="item-img"
              data-fallback-idx="1"
              onerror="tryNextImgFallback(this, '${imgPathAttr}')"
            >
            <div class="item-qty-badge">${item.qty}</div>
          </div>
          <div class="item-details">
            <div class="item-name">${item.product.name}</div>
            <div class="item-meta">${[item.size && `Taille: ${item.size}`, item.color].filter(Boolean).join(' · ')}</div>
          </div>
          <div class="item-price">$${(item.product.price * item.qty).toFixed(2)}</div>
        </div>
      `;
    }).join('');
  }

  const subtotal = getSubtotal();
  const free     = isFreeShipping();

  document.getElementById('subtotal-val').textContent = `$${subtotal.toFixed(2)}`;

  const shippingLine = document.getElementById('shipping-line');
  const shippingVal  = document.getElementById('shipping-val');
  if (free) {
    shippingLine.classList.add('free');
    shippingVal.textContent = 'Gratuite 🎉';
  } else {
    shippingLine.classList.remove('free');
    shippingVal.textContent = `$${SHIPPING_COST.toFixed(2)}`;
  }

  document.getElementById('total-val').textContent = `$${getTotal().toFixed(2)}`;

  // Barre de progression livraison gratuite
  const banner    = document.getElementById('shipping-banner');
  const remaining = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const pct       = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  document.getElementById('progress-fill').style.width  = pct + '%';
  document.getElementById('progress-label').textContent = `$${subtotal.toFixed(2)} / $${SHIPPING_THRESHOLD}`;

  if (free) {
    banner.className = 'shipping-banner is-free';
    document.getElementById('banner-title').textContent     = '🎉 Livraison gratuite débloquée!';
    document.getElementById('banner-sub').innerHTML         = 'Félicitations — vous bénéficiez de la livraison offerte.';
    document.getElementById('progress-wrap').style.display  = 'none';
    document.getElementById('banner-truck-icon').className  = 'fa-solid fa-truck-fast';
  } else {
    banner.className = 'shipping-banner not-free';
    document.getElementById('banner-title').textContent     = 'Livraison offerte dès 200 $';
    document.getElementById('banner-sub').innerHTML         = `Plus que <strong>$${remaining.toFixed(2)}</strong> pour la livraison gratuite`;
    document.getElementById('progress-wrap').style.display  = 'block';
    document.getElementById('banner-truck-icon').className  = 'fa-solid fa-truck';
  }
}

// DATE MIN DE LIVRAISON
(function setMinDate() {
  const input = document.getElementById('date-livraison');
  const min   = new Date();
  min.setDate(min.getDate() + 3);
  input.min   = min.toISOString().split('T')[0];
  input.value = '';
})();

document.getElementById('date-livraison').addEventListener('change', function () {
  const box  = document.getElementById('delivery-info');
  const disp = document.getElementById('delivery-date-display');
  if (this.value) {
    const d = new Date(this.value);
    disp.textContent = d.toLocaleDateString('fr-DZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    box.classList.add('visible');
  } else {
    box.classList.remove('visible');
  }
});

document.getElementById('card-number').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').substring(0, 16);
  this.value = v.match(/.{1,4}/g)?.join(' ') || v;

  const iconVisa = document.getElementById('icon-visa');
  const iconMc   = document.getElementById('icon-mc');
  iconVisa.classList.remove('active');
  iconMc.classList.remove('active');

  if (v.startsWith('4'))                             iconVisa.classList.add('active');
  else if (/^5[1-5]/.test(v) || /^2[2-7]/.test(v)) iconMc.classList.add('active');
});

document.getElementById('card-expiry').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
  this.value = v;
});

document.getElementById('card-holder').addEventListener('input', function () {
  const pos  = this.selectionStart;
  this.value = this.value.toUpperCase();
  this.setSelectionRange(pos, pos);
});

// VALIDATION
function validate() {
  let ok = true;
  const required = [
    'prenom', 'nom', 'email', 'phone',
    'adresse', 'ville', 'wilaya', 'date-livraison',
    'card-holder', 'card-number', 'card-expiry', 'card-cvv'
  ];

  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) {
      el.classList.add('error');
      ok = false;
    } else {
      el.classList.remove('error');
    }
  });

  if (!ok) {
    const first = document.querySelector('.form-input.error, .form-select.error');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return ok;
}

['prenom', 'nom', 'email', 'phone', 'adresse', 'ville', 'wilaya',
 'date-livraison', 'card-holder', 'card-number', 'card-expiry', 'card-cvv']
  .forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => el.classList.remove('error'));
  });
function launchConfetti() {
  const colors = ['#C5A880', '#5F4B32', '#EBDCD0', '#3E2A1C', '#FAF6F0', '#c0a060'];
  for (let i = 0; i < 80; i++) {
    const c         = document.createElement('div');
    c.className     = 'confetti-piece';
    c.style.cssText = `
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.8}s;
      transform: rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(c);
    c.addEventListener('animationend', () => c.remove());
  }
}
document.getElementById('submit-order').addEventListener('click', function () {
  if (!validate()) return;

  this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Traitement en cours...';
  this.disabled  = true;

  setTimeout(() => {
    const orderNum = '#SR-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('confirm-order-num').textContent = orderNum;

    const dateVal   = document.getElementById('date-livraison').value;
    const deliveryD = dateVal
      ? new Date(dateVal).toLocaleDateString('fr-DZ', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Sous 7 jours';

    document.getElementById('confirm-delivery').textContent = deliveryD;
    document.getElementById('confirm-total').textContent    = `$${getTotal().toFixed(2)}`;

    document.getElementById('success-overlay').classList.add('active');
    launchConfetti();
    document.getElementById('step-confirm').classList.add('active');

    POSSIBLE_KEYS.forEach(k => localStorage.removeItem(k));
  }, 1800);
});

renderSummary();