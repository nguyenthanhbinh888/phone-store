# 🛡️ CẨM NANG HƯỚNG DẪN QUẢN TRỊ VIÊN (ADMIN GUIDE) — PHONE STORE

> Tài liệu hướng dẫn nghiệp vụ và vận hành hệ thống Phone Store dành riêng cho Quản trị viên (Admin), Nhân viên quản lý kho và Bộ phận vận hành xử lý đơn hàng.

---

## 📌 MỤC LỤC
1. [Đăng Nhập & Truy Cập Bảng Quản Trị](#1-đăng-nhập--truy-cập-bảng-quản-trị)
2. [Bảng Điều Khiển Doanh Thu & Chỉ Số KPI (Dashboard)](#2-bảng-điều-khiển-doanh-thu--chỉ-số-kpi-dashboard)
3. [Quy Trình Quản Lý & Vận Đơn (Orders Management)](#3-quy-trình-quản-lý--vận-đơn-orders-management)
4. [Quản Trị Tồn Kho & Nhập Hàng Nhanh (Quick Restock)](#4-quản-trị-tồn-kho--nhập-hàng-nhanh-quick-restock)
5. [Đăng Mới Điện Thoại & Quản Lý Sản Phẩm (Product Catalog)](#5-đăng-mới-điện-thoại--quản-lý-sản-phẩm-product-catalog)
6. [Kiểm Duyệt Đánh Giá Khách Hàng (Review Moderation)](#6-kiểm-duyệt-đánh-giá-khách-hàng-review-moderation)
7. [Các Lưu Ý Nghiệp Vụ & Xử Lý Tình Huống Thường Gặp](#7-các-lưu-ý-nghiệp-vụ--xử-lý-tình-huống-thường-gặp)

---

## 1. Đăng Nhập & Truy Cập Bảng Quản Trị

### 1.1. Thông tin đăng nhập
- **Địa chỉ website:** `http://localhost:5173`
- **Tài khoản quản trị mặc định:**
  - **Tên đăng nhập:** `admin`
  - **Mật khẩu:** `admin123`
  - **Quyền hạn:** `ROLE_ADMIN`

### 1.2. Cách truy cập Bảng Quản trị (Admin Portal)
1. Truy cập vào trang chủ `http://localhost:5173`.
2. Bấm nút **"Đăng nhập"** ở góc phải trên cùng và điền tài khoản `admin` / `admin123`.
3. Sau khi đăng nhập thành công, bạn sẽ thấy:
   - Huy hiệu đại diện màu hổ phách với nhãn **ADMIN**.
   - Nút **"Quản trị"** xuất hiện ngay trên thanh menu chính.
   - Tùy chọn **"⚡ Quản trị Admin"** trong menu tài khoản.
4. Bấm vào nút này hoặc truy cập trực tiếp đường dẫn: **`http://localhost:5173/admin`**.

> [!IMPORTANT]
> Toàn bộ các API bắt đầu bằng `/api/admin/**` đều được bảo vệ nghiêm ngặt bằng JWT ở tầng Backend. Nếu người dùng thông thường (`ROLE_USER`) cố tình truy cập sẽ nhận phản hồi từ chối `403 Forbidden`.

---

## 2. Bảng Điều Khiển Doanh Thu & Chỉ Số KPI (Dashboard)

Giao diện tab **"📊 Tổng quan doanh thu"** cung cấp bức tranh tài chính và vận hành thời gian thực:

### 2.1. 4 Thẻ chỉ số KPI quan trọng
| Chỉ số | Ý nghĩa nghiệp vụ | Cách hệ thống tính toán |
|---|---|---|
| 💰 **Tổng Doanh Thu** | Tổng giá trị hàng bán thực tế | Cộng dồn `finalAmount` của toàn bộ đơn hàng thành công; **tự động loại trừ** các đơn đã bị Hủy (`CANCELLED`). |
| 📦 **Tổng Số Đơn Hàng** | Quy mô đơn phát sinh | Tổng số lượng đơn hàng khách đã khởi tạo trên toàn hệ thống. |
| ⏳ **Đơn Chờ Xử Lý** | Khối lượng đơn cần giải quyết gấp | Đếm số lượng đơn ở trạng thái `PENDING` chưa được duyệt. |
| ⚠️ **Cảnh Báo Hết Hàng** | Mức độ an toàn tồn kho | Đếm số lượng mẫu máy/phiên bản có số lượng tồn kho $\le 5$ máy. |

### 2.2. Bảng cảnh báo kho tồn thấp
- Tự động lọc và hiển thị danh sách tất cả các dòng máy sắp cạn hàng.
- Hiển thị rõ: Tên điện thoại, Màu sắc, Dung lượng, Số lượng tồn còn lại.
- Tích hợp nút **"Nhập kho nhanh"** để xử lý tức thì mà không cần tìm kiếm sản phẩm.

### 2.3. Bảng đơn hàng gần đây
- Hiển thị 5 đơn hàng mới nhất phát sinh trên website.
- Bấm nút **"Quản lý"** trên từng đơn để chuyển ngay sang tab Chi tiết Đơn hàng.

---

## 3. Quy Trình Quản Lý & Vận Đơn (Orders Management)

Chuyển sang tab **"📦 Quản lý Đơn hàng"** trên thanh công cụ Admin.

### 3.1. Sơ đồ vòng đời đơn hàng chuẩn (Order Lifecycle)

```
[ Khách đặt hàng ] ──> PENDING (Chờ duyệt)
                            │
               [ Admin xác nhận gọi điện / check tiền ]
                            ▼
                        CONFIRMED (Đã xác nhận)
                            │
               [ Bàn giao đơn vị vận chuyển / Shipper ]
                            ▼
                        SHIPPING (Đang giao hàng)
                            │
               [ Khách nhận hàng thành công ]
                            ▼
                        DELIVERED (Hoàn tất)
```

*(Nếu khách hủy hoặc đơn ảo: Chuyển sang `CANCELLED`)*

### 3.2. Hướng dẫn thao tác trên từng đơn hàng:
1. **Lọc đơn theo trạng thái:** Nhấp vào các tab thanh lọc (*Tất cả đơn*, *Chờ xác nhận*, *Đã xác nhận*, *Đang giao*, *Đã giao*, *Đã hủy*).
2. **Cập nhật trạng thái giao vận:**
   - Tại cột **Trạng thái**, chọn trạng thái mới trong danh sách thả xuống (`PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `SHIPPING` $\rightarrow$ `DELIVERED`).
   - Hệ thống lưu ngay lập tức và khách hàng sẽ thấy trạng thái mới trong mục *Đơn hàng của tôi*.
3. **Cập nhật trạng thái Thanh toán:**
   - Nếu đơn hàng là **Chuyển khoản VietQR**: Đối chiếu tài khoản ngân hàng xem tiền đã về hay chưa. Nếu đã có tiền, bấm **"Xác nhận đã thanh toán"** để đổi sang `Đã thanh toán (PAID)`.
   - Nếu đơn hàng là **COD**: Khi Shipper bàn giao lại tiền mặt, cập nhật sang `PAID`.
4. **Hủy đơn hàng (`CANCELLED`):**
   - Chỉ chọn `CANCELLED` khi khách yêu cầu hủy hoặc đơn hàng không liên lạc được.
   - **Cơ chế tự động:** Hệ thống sẽ ngay lập tức **cộng hoàn lại đúng số lượng máy của đơn này về kho hàng**!

---

## 4. Quản Trị Tồn Kho & Nhập Hàng Nhanh (Quick Restock)

Hệ thống Phone Store sở hữu cơ chế bảo toàn kho hàng chặt chẽ:
- Khi khách bấm đặt hàng: Tồn kho của màu & dung lượng đó **bị trừ ngay lập tức**.
- Nếu khách hoặc Admin hủy đơn: Tồn kho **tự động hoàn trả lại**.

### Cách thực hiện Nhập kho nhanh (Quick Restock):
1. **Tại Tab Tổng quan** (bảng Cảnh báo kho) hoặc **Tab Quản lý điện thoại**:
2. Bấm nút **"Nhập kho nhanh"** tại dòng sản phẩm cần bổ sung hàng.
3. Cửa sổ nhập xuất hiện:
   - Hiển thị số lượng hiện tại (ví dụ: `2 máy`).
   - Nhập số lượng mới thực tế trong kho (ví dụ: nhập thêm 30 máy $\rightarrow$ điền `32`).
4. Bấm **"Lưu Tồn Kho"**.
5. Sản phẩm trên website sẽ mở lại trạng thái còn hàng và khách hàng có thể mua ngay lập tức.

---

## 5. Đăng Mới Điện Thoại & Quản Lý Sản Phẩm (Product Catalog)

Chuyển sang tab **"📱 Quản lý Điện thoại & Kho"**:

### 5.1. Các thông tin cần chuẩn bị trước khi đăng máy mới
- **Tên điện thoại:** Tên thương mại chính thức (ví dụ: *iPhone 16 Plus 256GB*, *Samsung Galaxy Z Fold6*).
- **Hãng:** Chọn từ danh sách (Apple, Samsung, Xiaomi, OPPO).
- **Danh mục:** Flagship (Cao cấp), Tầm trung, hoặc Phổ thông.
- **Hình ảnh sản phẩm (Tải trực tiếp từ máy tính):** Bấm vào khung tải ảnh để chọn tệp ảnh từ máy tính (PNG, JPG, WEBP, GIF tối đa 15MB). Hệ thống sẽ tự động tải lên và lưu trữ an toàn trên dữ liệu máy chủ (`/api/uploads/...`). Bạn cũng có thể bấm *"Hoặc dán link URL"* nếu muốn dùng link ảnh ngoài.
- **Thông số phần cứng:**
  - *Màn hình:* Kích thước, tấm nền, tần số quét (ví dụ: `6.7 inch Super Retina XDR OLED 120Hz`).
  - *Vi xử lý (Chip):* Tên vi xử lý (ví dụ: `Apple A18 Pro`, `Snapdragon 8 Gen 3`).
  - *Dung lượng pin:* mAh & công nghệ sạc (ví dụ: `4685 mAh, Sạc nhanh 30W`).
  - *Camera:* Thông số camera (ví dụ: `48MP Chính + 12MP Siêu rộng + 12MP Tele`).
  - *Hệ điều hành:* `iOS 18` hoặc `Android 15`.
- **Phiên bản cấu hình mở bán ban đầu:**
  - Màu sắc: Tên màu (ví dụ: *Titan Sa Mạc*, *Titan Tự Nhiên*).
  - Dung lượng: `128GB`, `256GB`, `512GB`, `1TB`.
  - Tồn kho: Số lượng máy nhập về ban đầu.
  - Giá bán: Giá khách phải trả (VNĐ).
  - Giá niêm yết: Giá gốc của hãng để hiển thị giảm giá khuyến mãi (VNĐ).

### 5.2. Các bước đăng sản phẩm:
1. Nhấp nút **"+ Thêm Mới Điện Thoại"** ở góc phải trên cùng.
2. Điền đầy đủ thông tin vào Form.
3. Tích chọn **"Sản phẩm nổi bật (Featured)"** nếu muốn máy xuất hiện tại khu vực VIP của Trang Chủ.
4. Bấm nút **"Tạo Điện Thoại Ngay"**.
5. Máy sẽ xuất hiện ngay trên giao diện khách hàng với đầy đủ ảnh, thông số kỹ thuật và phiên bản vừa cấu hình.

### 5.3. Chỉnh sửa thông tin sản phẩm đã có (Edit Product)
1. Tại tab **"📱 Quản lý Điện thoại & Kho"**, tìm sản phẩm cần sửa thông tin.
2. Nhấp vào nút **"Sửa"** (biểu tượng cây bút màu xanh tím) ở cột *Thao Tác*.
3. Cửa sổ **"Sửa Thông Tin Điện Thoại"** xuất hiện và điền sẵn toàn bộ dữ liệu hiện tại của máy:
   - *Tên điện thoại, Thương hiệu, Danh mục*.
   - *Ảnh đại diện:* Hiển thị ảnh hiện tại, có nút **"Đổi ảnh khác từ máy"** để tải ảnh mới từ máy tính lưu vào hệ thống, hoặc dán link URL.
   - *Thông số kỹ thuật:* Màn hình, Vi xử lý (Chip), Pin & Sạc, Camera, Hệ điều hành (OS).
   - *Đánh dấu Nổi bật (Featured):* Bật/tắt hiển thị ở trang chủ.
   - *Mô tả chi tiết:* Cập nhật nội dung giới thiệu sản phẩm.
4. Bấm **"Cập Nhật Thông Tin"** để lưu lại ngay lập tức. Toàn bộ thông tin mới sẽ được áp dụng trực tiếp ra website.

### 5.4. Ngừng bán / Xóa mềm sản phẩm (Soft Delete)
- Khi một dòng máy bị hãng ngừng sản xuất hoặc hết hàng lâu dài, bấm biểu tượng **Thùng rác màu đỏ** tại dòng sản phẩm đó.
- Sản phẩm sẽ chuyển sang trạng thái ẩn (`is_active = false`), không còn hiển thị cho khách mua nữa.
- Toàn bộ hóa đơn và đơn hàng cũ của khách hàng đã mua chiếc máy này vẫn được bảo toàn nguyên vẹn trong cơ sở dữ liệu.

---

## 6. Kiểm Duyệt Đánh Giá Khách Hàng (Review Moderation)

Website tích hợp tính năng đánh giá 1-5 ⭐ kèm nhận xét của khách hàng.

### Cách thức kiểm duyệt:
1. Truy cập vào bất kỳ sản phẩm nào trên website (`/products/{slug}`).
2. Cuộn xuống khu vực **"Đánh Giá & Nhận Xét Từ Khách Hàng"**.
3. **Quyền đặc biệt của Admin:** Bên cạnh số sao của mỗi nhận xét, Quản trị viên sẽ nhìn thấy **Biểu tượng Thùng rác màu đỏ** (người dùng thông thường không nhìn thấy biểu tượng này trừ khi là nhận xét của chính họ).
4. Nếu phát hiện bình luận:
   - Chứa từ ngữ thô tục, quảng cáo, spam đường link độc hại.
   - Nội dung giả mạo phá hoại thương hiệu.
5. Nhấp vào biểu tượng thùng rác và xác nhận `OK` để xóa vĩnh viễn đánh giá đó khỏi hệ thống.

---

## 7. Các Lưu Ý Nghiệp Vụ & Xử Lý Tình Huống Thường Gặp

### Tình huống 1: Khách hàng phản ánh "Không thể thêm vào giỏ hàng hoặc đặt hàng"
- **Nguyên nhân:** Phiên bản màu/bộ nhớ đó đã hết hàng trong kho (`stockQuantity = 0`).
- **Cách xử lý:** Vào Admin Dashboard $\rightarrow$ Kiểm tra Bảng cảnh báo kho tồn thấp $\rightarrow$ Bấm **"Nhập kho nhanh"** và điền số lượng máy vừa về kho.

### Tình huống 2: Khách hàng chuyển khoản VietQR nhưng bấm nhầm hoặc ứng dụng chưa phản hồi
- **Cách xử lý:** 
  1. Kiểm tra biến động số dư tài khoản ngân hàng của Công ty.
  2. Tìm đơn hàng có mã nội dung chuyển khoản tương ứng (ví dụ: `ORD-20261019-XXXXX`).
  3. Tại tab *Quản lý Đơn hàng*, bấm nút **"Xác nhận đã thanh toán"** trên đơn hàng đó để chuyển trạng thái sang `PAID`.

### Tình huống 3: Cần sao lưu an toàn cơ sở dữ liệu bán hàng
- **Thực hiện sao lưu định kỳ:**
  - Trên Windows: Nhấp đúp chuột vào file [`backup_database.bat`](file:///c:/Users/Admin/.gemini/antigravity-ide/scratch/phone-store/backup_database.bat).
  - Bản sao lưu `.sql` sẽ tự động được lưu với định dạng ngày giờ chuẩn xác vào thư mục `./backups/`.

---

> [!TIP]
> **Đường link nhanh:**
> - Bảng điều khiển Quản trị: [http://localhost:5173/admin](http://localhost:5173/admin)
> - Tài liệu kỹ thuật Swagger: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
