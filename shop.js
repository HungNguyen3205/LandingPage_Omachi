const variants = {
  single: { name: '1 gói', price: 9000 },
  bundle: { name: 'Combo 5 gói', price: 42000 },
  box: { name: 'Thùng 30 gói', price: 240000 },
};
const products = {
  beef: {
    flavor: 'Xốt bò hầm', weight: '80 g', image: 'omachi-bo-ham.webp',
    description: 'Sợi mì khoai tây và trứng kết hợp cùng xốt bò hầm đậm vị.',
    source: 'https://minhcaumart.vn/san-pham/thuc-pham-che-bien/mi-an-lien/mi-dinh-duong-omachi-xot-bo-ham-80g.html?location=-1',
  },
  shrimp: {
    flavor: 'Tôm chua cay', weight: '78 g', image: 'omachi-tom-chua-cay.webp',
    description: 'Vị tôm hòa cùng vị chua và cay. Hình trên là bao bì song ngữ của gói 78 g.',
    source: 'https://www.sayweee.com/vi/product/Omachi-Instant-Noodles-Hot-Sour-Shrimp-Flavor/69554',
  },
  rib: {
    flavor: 'Sườn hầm ngũ quả', weight: '80 g', image: 'omachi-suon-ngu-qua.webp',
    description: 'Mì khoai tây với nước dùng vị sườn hầm và rau củ.',
    source: 'https://kingfoodmart.com/mi-an-lien/mi-dinh-duong-khoai-tay-suon-ham-ngu-qua-omachi-80g-1-goi',
  },
};
const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const cart = {};
let selected = 'single';
let selectedProduct = 'beef';
let toastTimer;
try {
  const saved = JSON.parse(localStorage.getItem('omachi-cart')) ?? {};
  for (const product of Object.keys(products)) {
    for (const variant of Object.keys(variants)) {
      const id = product + ':' + variant;
      const amount = saved[id] ?? (product === 'beef' ? saved[variant] : undefined);
      if (Number.isInteger(amount) && amount > 0 && amount <= 99) cart[id] = amount;
    }
  }
} catch {
  // The cart is still usable when local storage is disabled.
}
const hero = document.querySelector('#hero');
const thumbs = [...document.querySelectorAll('[data-product]')];
for (const thumb of thumbs) {
  thumb.addEventListener('click', () => {
    selectedProduct = thumb.dataset.product;
    const product = products[selectedProduct];
    const name = 'Mì Omachi ' + product.flavor;
    hero.src = 'assets/' + product.image;
    hero.alt = 'Bao bì ' + name + ' ' + product.weight;
    document.querySelector('#product-title').textContent = name;
    document.querySelector('#product-description').textContent = product.description;
    document.querySelector('#product-weight').textContent = product.weight;
    document.querySelector('#flavor-badge').textContent = product.flavor.toLocaleUpperCase('vi');
    document.querySelector('#product-flavor').textContent = product.flavor;
    document.querySelector('#product-source').href = product.source;
    document.querySelector('#product-status').textContent = name + ', ' + product.weight;
    for (const item of thumbs) item.setAttribute('aria-pressed', String(item === thumb));
  });
}

const price = document.querySelector('#price');
const barPrice = document.querySelector('#bar-price');
const picker = [...document.querySelectorAll('input[name="pack"]')];
function updatePrice() {
  selected = picker.find((input) => input.checked).value;
  const label = currency.format(variants[selected].price);
  price.textContent = label;
  barPrice.textContent = label;
}
for (const input of picker) input.addEventListener('change', updatePrice);
window.addEventListener('pageshow', updatePrice);
updatePrice();

const order = document.querySelector('#order');
const title = document.querySelector('#dialog-title');
const cartItems = document.querySelector('#cart-items');
const total = document.querySelector('#total');
const count = document.querySelector('[data-count]');
const feedback = document.querySelector('#feedback');

function renderCart() {
  let sum = 0;
  let quantity = 0;
  cartItems.replaceChildren();
  for (const [id, amount] of Object.entries(cart)) {
    const [product, variant] = id.split(':');
    const item = variants[variant];
    const label = products[product].flavor + ' · ' + item.name;
    sum += item.price * amount;
    quantity += amount;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = '<div><strong></strong><small></small></div><div class="counter"><button type="button" data-change="-1">−</button><span></span><button type="button" data-change="1">+</button></div>';
    row.querySelector('strong').textContent = label;
    row.querySelector('small').textContent = currency.format(item.price);
    row.querySelector('.counter span').textContent = amount;
    for (const button of row.querySelectorAll('[data-change]')) {
      const delta = Number(button.dataset.change);
      button.setAttribute('aria-label', (delta < 0 ? 'Giảm ' : 'Tăng ') + label);
      button.dataset.variant = id;
      button.disabled = delta > 0 && amount === 99;
    }
    cartItems.append(row);
  }
  if (!quantity) cartItems.textContent = 'Giỏ hàng đang trống.';
  total.textContent = currency.format(sum);
  count.textContent = quantity;
}

function adjustCart(id, delta) {
  const quantity = Math.min(99, (cart[id] ?? 0) + delta);
  if (quantity > 0) cart[id] = quantity;
  else delete cart[id];
  try {
    localStorage.setItem('omachi-cart', JSON.stringify(cart));
  } catch {
    // Retain the in-memory cart for this page.
  }
  renderCart();
}

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-variant]');
  if (!button) return;
  const { variant, change } = button.dataset;
  adjustCart(variant, Number(change));
  const next = cartItems.querySelector('[data-variant="' + variant + '"][data-change="' + change + '"]:enabled')
    ?? cartItems.querySelector('[data-variant]:enabled')
    ?? order.querySelector('.close');
  next.focus();
});
document.querySelector('[data-open="cart"]').addEventListener('click', () => {
  title.textContent = 'Giỏ hàng';
  order.showModal();
});
document.querySelector('#add').addEventListener('click', () => {
  clearTimeout(toastTimer);
  const id = selectedProduct + ':' + selected;
  if (cart[id] === 99) {
    feedback.textContent = 'Đã đạt giới hạn 99 cho quy cách này.';
  } else {
    adjustCart(id, 1);
    feedback.textContent = 'Đã thêm ' + variants[selected].name + ' vị ' + products[selectedProduct].flavor.toLocaleLowerCase('vi') + ' vào giỏ.';
  }
  toastTimer = setTimeout(() => { feedback.textContent = ''; }, 2400);
});
document.querySelector('#buy').addEventListener('click', () => {
  adjustCart(selectedProduct + ':' + selected, 1);
  title.textContent = 'Xem lại giỏ hàng';
  order.showModal();
});
renderCart();
