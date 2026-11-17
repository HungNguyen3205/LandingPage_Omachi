const variants = {
  single: { name: '1 gói', price: 9000 },
  bundle: { name: 'Combo 5 gói', price: 42000 },
  box: { name: 'Thùng 30 gói', price: 240000 },
};
const products = {
  beef: {
    format: 'Mì gói', unit: 'gói', flavor: 'Xốt bò hầm', weight: '80 g', image: 'omachi-bo-ham.webp',
    description: 'Sợi mì khoai tây và trứng kết hợp cùng xốt bò hầm đậm vị.',
    detail: 'Sợi mì khoai tây và trứng kết hợp với xốt vị bò hầm. Dạng gói phù hợp khi pha tại nhà và muốn dùng tô riêng, tự chọn rau và món ăn kèm.',
    serving: 'Khi mì chín, khuấy đều để xốt hòa vào nước dùng. Có thể thêm hành lá, ngò gai hoặc vài lát bò đã nấu chín. Để dùng như bữa nhẹ, thêm rau cải chần hoặc một quả trứng luộc.',
    prep: 'Mở gói, cho vắt mì và các gói gia vị vào tô chịu nhiệt theo hướng dẫn trên bao bì.',
    source: 'https://minhcaumart.vn/san-pham/thuc-pham-che-bien/mi-an-lien/mi-dinh-duong-omachi-xot-bo-ham-80g.html?location=-1',
  },
  bowl: {
    format: 'Mì tô', unit: 'tô', flavor: 'Xốt bò hầm', weight: '92 g', image: 'omachi-to.webp',
    prices: { single: 15000, bundle: 70000 },
    description: 'Mì khoai tây xốt bò hầm trong tô có sẵn, thuận tiện khi dùng tại văn phòng hoặc ở nơi có nước sôi.',
    detail: 'Mì tô Omachi xốt bò hầm có khối lượng tịnh 92 g. Tô có miệng rộng để dễ khuấy gia vị và gắp mì. Có thể pha trực tiếp trong tô khi làm theo chỉ dẫn in trên bao bì.',
    serving: 'Khi mì đạt độ mềm mong muốn theo thời gian ghi trên nhãn, khuấy từ đáy tô để xốt hòa đều. Thêm hành lá, rau cải chần hoặc một ít ớt nếu thích.',
    prep: 'Mở nắp theo hướng dẫn và thêm các gói gia vị vào tô.',
    source: 'https://tmart.vn/product/mi-omachi-xot-bo-ham-hop-92g18',
  },
  cup: {
    format: 'Mì ly', unit: 'ly', flavor: 'Xốt bò hầm', weight: '68 g', image: 'omachi-ly.webp',
    prices: { single: 13000, bundle: 60000 },
    description: 'Mì khoai tây xốt bò hầm trong ly nhỏ gọn, dùng cho bữa nhẹ khi có nước sôi.',
    detail: 'Mì ly Omachi xốt bò hầm có khối lượng tịnh 68 g. Dáng ly cao và gọn giúp dễ cất trong ngăn bàn hoặc túi đồ. Khi pha, đặt ly trên mặt phẳng chắc chắn và làm theo vạch nước, thời gian ghi trên bao bì.',
    serving: 'Khuấy đều sau khi mì chín để gia vị tan hết. Có thể dùng kèm rau, trứng luộc hoặc thêm chút tiêu. Để ly trên mặt phẳng khi ăn vì nước dùng còn nóng.',
    prep: 'Mở nắp ly theo hướng dẫn rồi cho gia vị vào ly.',
    source: 'https://saphavi.eu/collections/mi-an-lien/products/mi-ly-omachi-h%C6%B0%C6%A1ng-v%E1%BB%8B-x%E1%BB%91t-bo-h%E1%BA%A7m-thung-24-goi-x-68g',
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
function getVariant(product, variant) {
  const item = variants[variant];
  if (!product.prices) return item;
  const price = product.prices[variant];
  return price ? { price, name: item.name.replace('gói', product.unit) } : null;
}
const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const cart = {};
let selected = 'single';
let selectedProduct = 'beef';
let toastTimer;
try {
  const saved = JSON.parse(localStorage.getItem('omachi-cart')) ?? {};
  for (const product of Object.keys(products)) {
    for (const variant of Object.keys(variants)) {
      if (!getVariant(products[product], variant)) continue;
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
    const name = product.format + ' Omachi ' + product.flavor.toLocaleLowerCase('vi');
    hero.src = 'assets/' + product.image;
    hero.alt = 'Bao bì ' + name + ' ' + product.weight;
    document.querySelector('#product-title').textContent = name;
    document.querySelector('#product-description').textContent = product.description;
    document.querySelector('#product-weight').textContent = product.weight;
    document.querySelector('#flavor-badge').textContent = product.format.toLocaleUpperCase('vi');
    document.querySelector('#product-flavor').textContent = product.flavor;
    document.querySelector('#product-source').href = product.source;
    document.querySelector('#product-status').textContent = name + ', ' + product.weight;
    document.querySelector('#description-product').textContent = name;
    document.querySelector('#description-body').textContent = product.detail;
    document.querySelector('#description-serving').textContent = product.serving;
    document.querySelector('#prep-format').textContent = product.prep;
    updatePrice();
    document.dispatchEvent(new CustomEvent('omachi-product', { detail: { id: selectedProduct, name } }));
    for (const item of thumbs) item.setAttribute('aria-pressed', String(item === thumb));
  });
}

const price = document.querySelector('#price');
const barPrice = document.querySelector('#bar-price');
const picker = [...document.querySelectorAll('input[name="pack"]')];
function updatePrice() {
  selected = picker.find((input) => input.checked).value;
  const product = products[selectedProduct];
  if (!getVariant(product, selected)) {
    picker[0].checked = true;
    selected = picker[0].value;
  }
  for (const input of picker) {
    const item = getVariant(product, input.value);
    input.disabled = !item;
    input.parentElement.hidden = !item;
    if (item) input.nextElementSibling.textContent = item.name;
  }
  const label = currency.format(getVariant(product, selected).price);
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
    const item = getVariant(products[product], variant);
    const label = (products[product].format ?? products[product].flavor) + ' · ' + item.name;
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
    feedback.textContent = 'Đã thêm ' + getVariant(products[selectedProduct], selected).name + ' Omachi' + ' vào giỏ.';
  }
  toastTimer = setTimeout(() => { feedback.textContent = ''; }, 2400);
});
document.querySelector('#buy').addEventListener('click', () => {
  adjustCart(selectedProduct + ':' + selected, 1);
  title.textContent = 'Xem lại giỏ hàng';
  order.showModal();
});
renderCart();
