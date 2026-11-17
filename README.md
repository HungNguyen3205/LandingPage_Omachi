# LandingPage Omachi

Trang giới thiệu sản phẩm theo bố cục bán hàng TikTok Shop. Có ba loại mì gói, tô và ly, ảnh bao bì thật, mô tả riêng, giá minh họa và giỏ hàng. Bình luận được lưu bằng localStorage và hiển thị riêng theo từng loại trên trình duyệt đang dùng.

## Xem trên máy

Chạy `python3 -m http.server 8000` từ thư mục gốc rồi mở http://localhost:8000.

## Triển khai

Import repo vào Vercel với Root Directory `./`. Cấu hình trong `vercel.json` phục vụ các file tĩnh trực tiếp.

Giá minh họa được khai báo trong `shop.js`. Giỏ hàng dùng localStorage. Trang hiện ở chế độ giới thiệu sản phẩm và xem trước giỏ hàng.
