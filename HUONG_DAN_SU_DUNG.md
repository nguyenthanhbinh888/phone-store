# 📖 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG WEBSITE PHONE STORE

> Tài liệu hướng dẫn chi tiết toàn bộ các chức năng dành cho **Khách hàng mua sắm** và **Quản trị viên (Admin)** trên hệ thống Phone Store.

---

## 📌 MỤC LỤC
1. [Thông Tin Truy Cập & Tài Khoản Kiểm Thử](#1-thông-tin-truy-cập--tài-khoản-kiểm-thử)
2. [Hướng Dẫn Dành Cho Khách Hàng (Customer)](#2-hướng-dẫn-dành-cho-khách-hàng-customer)
   - [2.1. Đăng ký & Đăng nhập](#21-đăng-ký--đăng-nhập)
   - [2.2. Tìm kiếm & Lọc sản phẩm](#22-tìm-kiếm--lọc-sản-phẩm)
   - [2.3. Xem chi tiết & Chọn phiên bản cấu hình](#23-xem-chi-tiết--chọn-phiên-bản-cấu-hình)
   - [2.4. Đánh giá & Nhận xét sản phẩm (Reviews)](#24-đánh-giá--nhận-xét-sản-phẩm-reviews)
   - [2.5. Quản lý Giỏ hàng (Cart)](#25-quản-lý-giỏ-hàng-cart)
   - [2.6. Quy trình Đặt hàng & Thanh toán (COD / VietQR)](#26-quy-trình-đặt-hàng--thanh-toán-cod--vietqr)
   - [2.7. Theo dõi đơn hàng & Hủy đơn cá nhân](#27-theo-dõi-đơn-hàng--hủy-đơn-cá-nhân)
3. [Hướng Dẫn Dành Cho Quản Trị Viên (Admin)](#3-hướng-dẫn-dành-cho-quản-trị-viên-admin)
   - [3.1. Truy cập Trang Quản Trị (/admin)](#31-truy-cập-trang-quản-trị-admin)
   - [3.2. Bảng điều khiển Doanh thu & Cảnh báo kho (Overview)](#32-bảng-điều-khiển-doanh-thu--cảnh-báo-kho-overview)
   - [3.3. Nhập hàng nhanh (Quick Restock)](#33-nhập-hàng-nhanh-quick-restock)
   - [3.4. Quản lý & Cập nhật trạng thái Đơn hàng](#34-quản-lý--cập-nhật-trạng-thái-đơn-hàng)
   - [3.5. Quản lý Điện thoại & Thêm mới sản phẩm](#35-quản-lý-điện-thoại--thêm-mới-sản-phẩm)
   - [3.6. Quản lý Đánh giá sản phẩm](#36-quản-lý-đánh-giá-sản-phẩm)
4. [Tài Liệu Kỹ Thuật & Swagger API](#4-tài-liệu-kỹ-thuật--swagger-api)

---

## 1. Thông Tin Truy Cập & Tài Khoản Kiểm Thử

| Dịch vụ | Đường dẫn (URL) | Mô tả |
|---|---|---|
| **Giao diện Website Khách hàng** | `http://localhost:5173` | Giao diện mua sắm, giỏ hàng, đặt hàng |
| **Trang Quản trị Admin** | `http://localhost:5173/admin` | Bảng điều khiển thống kê, quản lý đơn & kho |
| **Backend API & Swagger UI** | `http://localhost:8080/swagger-ui.html` | Tài liệu API tương tác trực tiếp |

### 🔑 Danh sách tài khoản mẫu:

| Loại tài khoản | Username | Mật khẩu | Quyền hạn |
|---|---|---|---|
| **Quản trị viên (Admin)** | `admin` | `admin123` | `ROLE_ADMIN` (Toàn quyền quản trị) |
| **Khách hàng (User)** | `user` | `user123` | `ROLE_USER` (Mua sắm, đặt hàng, đánh giá) |

---

## 2. Hướng Dẫn Dành Cho Khách Hàng (Customer)

### 2.1. Đăng ký & Đăng nhập
1. Nhấp vào nút **"Đăng nhập"** ở góc phải trên cùng của thanh điều hướng (Navbar).
2. **Đăng nhập:** Nhập tên tài khoản hoặc email và mật khẩu (ví dụ: `user` / `user123`) rồi bấm **"Đăng nhập ngay"**.
3. **Đăng ký tài khoản mới:** Chuyển sang tab **"Đăng ký"**, điền các thông tin:
   - Họ và tên
   - Tên đăng nhập (viết liền không dấu)
   - Địa chỉ Email
   - Mật khẩu (tối thiểu 6 ký tự)
4. Sau khi đăng nhập thành công, góc phải trên cùng sẽ hiển thị Tên của bạn cùng huy hiệu **THÀNH VIÊN**.

---

### 2.2. Tìm kiếm & Lọc sản phẩm
- **Tìm kiếm nhanh theo từ khóa:** Nhập tên máy (ví dụ: *iPhone*, *Galaxy*, *Ultra*) vào ô tìm kiếm trên Navbar và bấm `Enter`.
- **Lọc đa tiêu chí tại trang Tất cả sản phẩm (`/products`):**
  - **Theo Hãng:** Apple, Samsung, Xiaomi, OPPO,...
  - **Theo Danh mục:** Điện thoại Flagship, Tầm trung, Phổ thông.
  - **Theo Mức giá:** Dưới 5 triệu, 5 - 15 triệu, 15 - 25 triệu, Trên 25 triệu.
  - **Theo Cấu hình phần cứng:** RAM (8GB, 12GB, 16GB), Bộ nhớ trong (128GB, 256GB, 512GB, 1TB).
  - **Sắp xếp:** Giá tăng dần, Giá giảm dần, Mới nhất, Bán chạy nhất.

---

### 2.3. Xem chi tiết & Chọn phiên bản cấu hình
Tại trang chi tiết sản phẩm (`/products/{slug}`):
1. **Chọn Màu sắc & Dung lượng:**
   - Nhấp vào các nút màu sắc hoặc tùy chọn bộ nhớ (ví dụ: *Titan Tự Nhiên*, *256GB*).
   - Hệ thống sẽ tự động cập nhật ngay lập tức: **Giá bán**, **Giá niêm yết**, **Phần trăm giảm giá**, **Số lượng tồn kho thực tế** và **Hình ảnh màu tương ứng**.
2. **Xem Thông số kỹ thuật:** Bảng thông số chi tiết hiển thị đầy đủ Màn hình, Vi xử lý (Chip), Pin & Sạc, Hệ thống Camera, Hệ điều hành.
3. **Thêm vào giỏ hàng:** Chọn số lượng cần mua và bấm nút **"Thêm Vào Giỏ Hàng"**.

---

### 2.4. Đánh giá & Nhận xét sản phẩm (Reviews)
Nằm ở phần chân trang chi tiết sản phẩm:
1. **Xem điểm trung bình:** Hiển thị điểm sao tổng hợp (ví dụ: `5.0 ★ / 5.0`) kèm tổng số lượt khách hàng đã đánh giá.
2. **Gửi đánh giá mới (Cần đăng nhập):**
   - Di chuột và chọn số sao tương ứng (từ 1 đến 5 sao: *Tuyệt vời*, *Rất tốt*, *Bình thường*, *Kém*, *Rất thất vọng*).
   - Nhập nội dung chia sẻ cảm nhận thực tế về thiết kế, thời lượng pin, camera.
   - Bấm nút **"Đăng Nhận Xét"**. Đánh giá sẽ xuất hiện ngay lập tức trong danh sách nhận xét.
3. **Xóa nhận xét:** Người dùng có thể tự xóa nhận xét của chính mình bằng biểu tượng thùng rác màu đỏ.

---

### 2.5. Quản lý Giỏ hàng (Cart)
1. Nhấp vào biểu tượng **Giỏ hàng** trên Navbar (có hiển thị số lượng badge màu đỏ).
2. Tại trang Giỏ hàng (`/cart`), bạn có thể:
   - Tăng/giảm số lượng từng mặt hàng (hệ thống sẽ tự động chặn nếu vượt quá tồn kho).
   - Xóa từng mặt hàng hoặc dọn sạch giỏ hàng.
   - Xem tóm tắt đơn giá, mức chiết khấu và tổng tiền cần thanh toán.
3. Bấm **"Tiến Hành Đặt Hàng"** để sang trang Thanh toán.

---

### 2.6. Quy trình Đặt hàng & Thanh toán (COD / VietQR)
Tại trang Thanh toán (`/checkout`):

#### Bước 1: Điền thông tin giao hàng
- Họ và tên người nhận, Số điện thoại liên hệ, Địa chỉ giao hàng chi tiết, và Ghi chú giao hàng (nếu có).

#### Bước 2: Chọn phương thức thanh toán
1. **Cách 1: Thanh toán khi nhận hàng (COD):**
   - Đơn hàng được tạo với trạng thái thanh toán là **Chưa thanh toán (UNPAID)**.
   - Bạn chỉ cần trả tiền mặt khi Shipper giao máy đến tận nhà.
2. **Cách 2: Chuyển khoản ngân hàng qua mã VietQR Napas247:**
   - Hệ thống lập tức hiển thị **Mã QR Động** đạt chuẩn Napas247 của ngân hàng Vietcombank.
   - **Tự động điền đầy đủ:** Số tài khoản nhận, Tên công ty, Số tiền chính xác và Nội dung chuyển khoản là Mã đơn hàng.
   - **Thao tác:** Khách hàng mở ứng dụng Mobile Banking của bất kỳ ngân hàng nào (Vietcombank, MB, Techcombank, VPBank,...) quét mã QR để chuyển tiền.
   - Bấm nút **"Tôi Đã Chuyển Khoản Thành Công"** để hệ thống xác nhận giao dịch chuyển sang trạng thái **ĐÃ THANH TOÁN (PAID)**.

> [!NOTE]
> Khi đơn hàng được đặt thành công, số lượng hàng trong kho sẽ **tự động trừ ngay lập tức** để đảm bảo không bị quá tải kho.

---

### 2.7. Theo dõi đơn hàng & Hủy đơn cá nhân
1. Nhấp vào Menu tài khoản ở Navbar -> chọn **"Đơn hàng của tôi"** (`/orders/my-orders`).
2. Xem danh sách toàn bộ các đơn hàng đã mua kèm trạng thái:
   - 🟡 **Chờ xác nhận (PENDING)**
   - 🔵 **Đã xác nhận (CONFIRMED)**
   - 🟣 **Đang vận chuyển (SHIPPING)**
   - 🟢 **Đã giao hàng (DELIVERED)**
   - 🔴 **Đã hủy (CANCELLED)**
3. **Hủy đơn hàng:**
   - Đối với các đơn đang ở trạng thái `PENDING` hoặc `CONFIRMED`, khách hàng có thể bấm nút **"Hủy Đơn Hàng"**.
   - Khi hủy đơn, hệ thống sẽ **tự động hoàn trả số lượng hàng về lại kho** cho các khách hàng khác tiếp tục mua sắm.

---

## 3. Hướng Dẫn Dành Cho Quản Trị Viên (Admin)

### 3.1. Truy cập Trang Quản Trị (/admin)
1. Đăng nhập với tài khoản:
   - **Username:** `admin`
   - **Password:** `admin123`
2. Sau khi đăng nhập, thanh điều hướng sẽ hiển thị:
   - Nút **"Quản trị"** màu vàng hổ phách trên Desktop navbar.
   - Tùy chọn **"⚡ Quản trị Admin"** trong menu người dùng.
3. Nhấp vào để mở **Bảng Điều Khiển Quản Trị** (`/admin`).

---

### 3.2. Bảng điều khiển Doanh thu & Cảnh báo kho (Overview)
Tại tab **"📊 Tổng quan doanh thu"**:
- **4 Thẻ số liệu KPI thời gian thực:**
  - 💰 **Tổng Doanh Thu:** Tổng số tiền bán hàng (tự động loại trừ các đơn đã hủy).
  - 📦 **Tổng Số Đơn Hàng:** Số lượng đơn đã phát sinh trên hệ thống.
  - ⏳ **Đơn Chờ Xử Lý:** Số đơn hàng mới khách vừa đặt cần duyệt gấp.
  - ⚠️ **Cảnh Báo Sắp Hết Hàng:** Số lượng phiên bản điện thoại có tồn kho $\le 5$ máy.
- **Bảng Cảnh báo tồn kho thấp:** Liệt kê các máy sắp hết hàng để thủ kho kịp thời nhập hàng.
- **Bảng Đơn hàng mới nhất:** Tóm tắt 5 đơn hàng vừa đặt kèm trạng thái thanh toán và tổng tiền.

---

### 3.3. Nhập hàng nhanh (Quick Restock)
1. Trong bảng cảnh báo tồn kho thấp hoặc tab Sản phẩm, nhấp vào nút **"Nhập kho nhanh"**.
2. Một cửa sổ nhỏ xuất hiện, hiển thị số lượng tồn hiện tại.
3. Nhập số lượng mới cần cập nhật (ví dụ: nhập thêm thành 50 máy) và bấm **"Lưu Tồn Kho"**.
4. Số lượng tồn kho mới được đồng bộ ngay tức thì lên trang bán hàng của khách.

---

### 3.4. Quản lý & Cập nhật trạng thái Đơn hàng
Chuyển sang tab **"📦 Quản lý Đơn hàng"**:
1. **Lọc đơn theo bộ lọc:** Bấm vào các thẻ *Tất cả đơn*, *Chờ xác nhận*, *Đã xác nhận*, *Đang giao*, *Đã giao*, *Đã hủy*.
2. **Cập nhật quy trình vận đơn:**
   - Chọn trạng thái mới tại ô thả xuống: `PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `SHIPPING` $\rightarrow$ `DELIVERED`.
   - Nếu khách yêu cầu hủy hoặc đơn gian lận, chuyển sang `CANCELLED` (hệ thống sẽ tự động hoàn kho lại cho sản phẩm).
3. **Cập nhật thanh toán:**
   - Khi shipper thu được tiền mặt COD hoặc nhận được tiền chuyển khoản ngân hàng, Admin nhấp nút **"Xác nhận đã thanh toán"** để chuyển trạng thái sang `PAID`.

---

### 3.5. Quản lý Điện thoại & Thêm mới sản phẩm
Chuyển sang tab **"📱 Quản lý Điện thoại & Kho"**:
1. **Xem danh sách toàn bộ máy:** Xem giá bán niêm yết, số phiên bản cấu hình, trạng thái kinh doanh (`Đang bán` / `Ngừng bán`).
2. **Thêm mới Điện thoại:**
   - Bấm nút **"+ Thêm Mới Điện Thoại"** ở góc phải.
   - Điền đầy đủ thông tin vào Form:
     - Tên điện thoại (ví dụ: *iPhone 16 Pro Max 512GB*)
     - Hãng sản xuất (Apple, Samsung, Xiaomi, OPPO,...)
     - Danh mục (Flagship, Tầm trung, Phổ thông)
     - Đường dẫn ảnh bìa Thumbnail
     - Thông số: Màn hình, Vi xử lý, Pin & Sạc, Hệ thống Camera, Hệ điều hành
     - Tùy chọn đánh dấu **"Sản phẩm nổi bật (Featured)"**
     - Thiết lập phiên bản khởi tạo ban đầu: Màu sắc, Dung lượng bộ nhớ, Số lượng tồn kho, Giá bán và Giá niêm yết.
   - Bấm **"Tạo Điện Thoại Ngay"**. Sản phẩm sẽ xuất hiện ngay trên trang chủ và danh mục.
3. **Xóa mềm điện thoại (Soft delete):** Bấm biểu tượng Thùng rác để ngừng kinh doanh sản phẩm mà không làm ảnh hưởng đến lịch sử các đơn hàng cũ đã mua.

---

### 3.6. Quản lý Đánh giá sản phẩm
- Với tư cách là Quản trị viên, khi xem bất kỳ trang chi tiết sản phẩm nào (`/products/{slug}`), Admin sẽ thấy biểu tượng **Thùng rác màu đỏ** bên cạnh tất cả nhận xét của mọi người dùng.
- Admin có thể xóa ngay các đánh giá vi phạm tiêu chuẩn cộng đồng, spam hoặc dùng ngôn từ không chuẩn mực.

---

## 4. Tài Liệu Kỹ Thuật & Swagger API

Dành cho lập trình viên và kiểm thử viên kiểm tra trực tiếp các API của hệ thống:

- **Swagger UI:** Truy cập `http://localhost:8080/swagger-ui.html`
- **Các nhóm API chính:**
  - `Authentication API`: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`
  - `Product API`: `/api/products`, `/api/products/{slug}`, `/api/products/featured`
  - `Category & Brand API`: `/api/categories`, `/api/brands`
  - `Order API`: `/api/orders`, `/api/orders/code/{code}`, `/api/orders/my-orders`, `/api/orders/{id}/cancel`
  - `Payment API`: `/api/payment/vietqr/{orderCode}`, `/api/payment/simulate-pay/{orderCode}`
  - `Admin API`: `/api/admin/dashboard`, `/api/admin/orders`, `/api/admin/products`
  - `Review API`: `/api/products/{productId}/reviews`, `/api/reviews/{id}`
