const reviewForm = document.querySelector('#review-form');
const reviewList = document.querySelector('#review-list');
const reviewCount = document.querySelector('#review-count');
const reviewStatus = document.querySelector('#review-status');
const reviewProduct = document.querySelector('#review-product');
const reviewStorageKey = 'omachi-reviews';
const reviewDate = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' });
const reviews = {};
let reviewProductId = 'beef';

try {
  const saved = JSON.parse(localStorage.getItem(reviewStorageKey)) ?? {};
  for (const id of ['beef', 'bowl', 'cup']) {
    if (!Array.isArray(saved[id])) continue;
    reviews[id] = saved[id].filter((entry) => entry && typeof entry.name === 'string'
      && typeof entry.message === 'string' && Number.isFinite(new Date(entry.date).getTime())).slice(0, 50);
  }
} catch {
  // Reviews can still be written in memory when storage is unavailable.
}

function renderReviews() {
  const entries = reviews[reviewProductId] ?? [];
  reviewCount.textContent = entries.length + ' bình luận';
  reviewList.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Chưa có bình luận cho sản phẩm này.';
    reviewList.append(empty);
  }
  for (const entry of entries) {
    const comment = document.createElement('article');
    const name = document.createElement('strong');
    const date = document.createElement('time');
    const message = document.createElement('p');
    name.textContent = entry.name;
    date.textContent = reviewDate.format(new Date(entry.date));
    message.textContent = entry.message;
    comment.append(name, date, message);
    reviewList.append(comment);
  }
}

document.addEventListener('omachi-product', (event) => {
  if (reviewProductId === event.detail.id) return;
  reviewProductId = event.detail.id;
  reviewProduct.textContent = event.detail.name;
  reviewStatus.textContent = '';
  renderReviews();
});

reviewForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(reviewForm);
  const name = data.get('displayName').trim();
  const message = data.get('message').trim();
  if (!name || !message) {
    reviewStatus.textContent = 'Nhập tên và nội dung bình luận.';
    return;
  }
  reviews[reviewProductId] = [{ name, message, date: new Date().toISOString() }, ...(reviews[reviewProductId] ?? [])].slice(0, 50);
  renderReviews();
  reviewForm.reset();
  try {
    localStorage.setItem(reviewStorageKey, JSON.stringify(reviews));
    reviewStatus.textContent = 'Đã lưu bình luận.';
  } catch {
    reviewStatus.textContent = 'Bình luận đã hiển thị. Trình duyệt không lưu được sau khi tải lại.';
  }
});

renderReviews();
