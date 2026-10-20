# 📱 PhoneStore — Website Bán Điện Thoại Thông Minh Trực Tuyến

> Dự án Full-stack Website Bán Điện Thoại Thông Minh chuẩn thương mại điện tử với kiến trúc hiện đại: **Java 21 LTS + Spring Boot 3.4.x**, **React 19 + TypeScript + Vite**, **MySQL 8.0**, và tích hợp thanh toán trực tuyến **VietQR Napas247**.

---

## 🏗️ 1. Kiến Trúc Hệ Thống (Architecture)

```
[ Frontend: React 19 + TypeScript + Vite + Vanilla CSS Glassmorphism ]
                             │
                  RESTful APIs (JSON / JWT Bearer)
                             ▼
[ Backend: Spring Boot 3.4.x (Java 21 LTS) + Spring Security 6 ]
  ├── /api/auth          : Đăng ký, đăng nhập JWT, giải mã phân quyền
  ├── /api/products      : Tra cứu sản phẩm, tìm kiếm, lọc đa tiêu chí
  ├── /api/categories    : Danh mục điện thoại (Flagship, Tầm trung, Phổ thông)
  ├── /api/brands        : Hãng sản xuất (Apple, Samsung, Xiaomi, OPPO)
  ├── /api/orders        : Giỏ hàng, đặt hàng COD, theo dõi vận đơn
  ├── /api/payment       : Sinh mã động VietQR Napas247, mô phỏng thanh toán
  ├── /api/admin         : Dashboard doanh thu, quản lý kho & cập nhật trạng thái đơn
  └── /api/products/*/reviews : Đánh giá & xếp hạng sao 1-5 sao từ khách hàng
                             │
                    Spring Data JPA / Hibernate
                             ▼
                 [ Database: MySQL 8.0 ]
```

---

## 🚀 2. Công Nghệ Sử Dụng (Tech Stack)

| Thành phần | Công nghệ | Chi tiết |
|---|---|---|
| **Backend** | Java 21 LTS, Spring Boot 3.4.3 | Spring Web, Spring Data JPA, Spring Security, Validation |
| **Bảo mật** | JJWT (io.jsonwebtoken 0.12.6) | BCrypt Password Hashing, Stateless JWT Bearer Filter |
| **Tài liệu API** | SpringDoc OpenAPI 2.8.5 | Swagger UI tương tác trực quan tại `/swagger-ui.html` |
| **Frontend** | React 19, TypeScript, Vite 8 | Lucide React Icons, React Router DOM v7 |
| **Styling** | Vanilla CSS Glassmorphism | Thiết kế hiện đại, Neon glow, responsive 100% mobile/desktop |
| **Thanh toán** | VietQR API | Sinh mã QR động Napas247 ngân hàng Vietcombank tự động |
| **Database** | MySQL 8.0 | InnoDB, UTF8MB4, ràng buộc khóa ngoại, quản lý tồn kho đồng bộ |
| **DevOps** | Docker, Docker Compose, Nginx | Multi-stage Dockerfile cho cả Backend và Frontend |

---

## 🔑 3. Tài Khoản Kiểm Thử Mặc Định (Demo Accounts)

Hệ thống đã tự động nạp sẵn tài khoản và dữ liệu mẫu:

| Tài khoản | Username | Mật khẩu | Quyền hạn | Chức năng kiểm thử |
|---|---|---|---|---|
| **Quản trị viên (Admin)** | `admin` | `admin123` | `ROLE_ADMIN` | Quản lý kho, doanh thu tại `/admin`, duyệt đơn hàng, thêm điện thoại mới |
| **Khách hàng (User)** | `user` | `user123` | `ROLE_USER` | Mua sắm, giỏ hàng, đặt hàng VietQR/COD, đánh giá sản phẩm, quản lý đơn cá nhân |

---

## 💻 4. Hướng Dẫn Cài Đặt & Chạy Môi Trường Local

### Yêu cầu tiên quyết:
- **Java 21 LTS** (`java -version`)
- **Maven 3.9+** (`mvn -v`)
- **Node.js 18+ & npm** (`node -v`)
- **MySQL 8.0** đang chạy trên cổng `3306`

### Bước 1: Khởi tạo Database MySQL
Tạo cơ sở dữ liệu `phone_store_db` trong MySQL:
```sql
CREATE DATABASE phone_store_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Bước 2: Khởi động Backend Spring Boot
```bash
cd phone-store-backend
mvn clean spring-boot:run
```
- Backend sẽ chạy tại: `http://localhost:8080`
- Swagger UI tài liệu API: `http://localhost:8080/swagger-ui.html`

### Bước 3: Khởi động Frontend React Vite
```bash
cd phone-store-frontend
npm install
npm run dev
```
- Frontend sẽ chạy tại: `http://localhost:5173`

---

## 🐳 5. Triển Khai Bằng Docker Compose (Production Ready)

Chỉ với 1 câu lệnh duy nhất để khởi chạy trọn gói Database, Backend và Frontend:

```bash
docker compose up -d --build
```

- **Frontend (Web App):** `http://localhost` (Port 80)
- **Backend API:** `http://localhost:8080`
- **MySQL Database:** `localhost:3306`

Dừng hệ thống:
```bash
docker compose down
```

---

## 💾 6. Sao Lưu & Phục Hồi Dữ Liệu (Backup & Restore)

- **Trên Windows:**
  Chạy file batch tự động lưu bản dump cơ sở dữ liệu vào thư mục `./backups/`:
  ```cmd
  backup_database.bat
  ```
- **Trên Linux / VPS:**
  ```bash
  chmod +x backup_database.sh
  ./backup_database.sh
  ```

---

## 🌟 7. Tóm Tắt 7 Giai Đoạn Phát Triển

- **Giai đoạn 1:** Khởi tạo kiến trúc dự án, kết nối MySQL và cấu hình chuẩn Java 21 / Vite React.
- **Giai đoạn 2:** Thiết kế Database Schema, JPA Entities, và API danh mục, thương hiệu, sản phẩm.
- **Giai đoạn 3:** Giao diện React phong cách Glassmorphism, bộ lọc sản phẩm đa tiêu chí, xem chi tiết cấu hình.
- **Giai đoạn 4:** Hệ thống xác thực JWT, mã hóa BCrypt, đăng nhập/đăng ký với AuthModal và phân quyền Admin/User.
- **Giai đoạn 5:** Giỏ hàng CartContext, luồng đặt hàng COD, trừ tồn kho đồng bộ và xem lịch sử đơn hàng.
- **Giai đoạn 6:** Admin Portal thống kê doanh thu, cảnh báo kho thấp, duyệt trạng thái đơn, và tích hợp thanh toán VietQR động.
- **Giai đoạn 7:** Hệ thống Đánh giá & Review sản phẩm (1-5 ⭐), tối ưu hóa SEO meta tags, cấu hình Docker Compose và kịch bản sao lưu dữ liệu.
