const variants = {
  single: { name: '1 gói', price: 9000 },
  bundle: { name: 'Combo 5 gói', price: 42000 },
  box: { name: 'Thùng 30 gói', price: 240000 },
};
const imageDescriptions = {
  '01': 'Gói mì khoai tây Omachi vị bò hầm',
  '02': 'Gói mì Omachi đã mở, thấy vắt mì bên trong',
  '06': 'Tô mì Omachi với thịt bò, hành lá và ớt',
};
const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const cart = {};
let selected = 'single';
let toastTimer;
try {
  const saved = JSON.parse(localStorage.getItem('omachi-cart')) ?? {};
  for (const id of Object.keys(variants)) {
    if (Number.isInteger(saved[id]) && saved[id] > 0 && saved[id] <= 99) cart[id] = saved[id];
  }
} catch {
  // The cart is still usable when local storage is disabled.
}
const hero = document.querySelector('#hero');
const thumbs = [...document.querySelectorAll('[data-image]')];
for (const thumb of thumbs) {
  thumb.addEventListener('click', () => {
    hero.src = 'assets/' + thumb.dataset.image + '.webp';
    hero.alt = imageDescriptions[thumb.dataset.image];
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
    const item = variants[id];
    sum += item.price * amount;
    quantity += amount;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = '<div><strong></strong><small></small></div><div class="counter"><button type="button" data-change="-1">−</button><span></span><button type="button" data-change="1">+</button></div>';
    row.querySelector('strong').textContent = item.name;
    row.querySelector('small').textContent = currency.format(item.price);
    row.querySelector('.counter span').textContent = amount;
    for (const button of row.querySelectorAll('[data-change]')) {
      const delta = Number(button.dataset.change);
      button.setAttribute('aria-label', (delta < 0 ? 'Giảm ' : 'Tăng ') + item.name);
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
  if (cart[selected] === 99) {
    feedback.textContent = 'Đã đạt giới hạn 99 cho quy cách này.';
  } else {
    adjustCart(selected, 1);
    feedback.textContent = 'Đã thêm ' + variants[selected].name + ' vào giỏ.';
  }
  toastTimer = setTimeout(() => { feedback.textContent = ''; }, 2400);
});
document.querySelector('#buy').addEventListener('click', () => {
  adjustCart(selected, 1);
  title.textContent = 'Xem lại giỏ hàng';
  order.showModal();
});
renderCart();
