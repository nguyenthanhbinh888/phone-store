# Đề cương dự án Website bán điện thoại

## 1. Tổng quan dự án

Xây dựng một website bán điện thoại trực tuyến theo mô hình Full-stack.

-   **Backend:** Java + Spring Boot
-   **Frontend:** React + TypeScript, sử dụng HTML5, CSS3 và JavaScript
-   **Database:** MySQL
-   **Hosting:** Chưa quyết định; sẽ lựa chọn sau khi hoàn thiện và kiểm
    thử hệ thống trên môi trường local.

Mục tiêu là tổ chức dự án theo hướng thực tế, dễ mở rộng và có thể phát
triển từng phần.

## 2. Kiến trúc tổng thể

``` text
Frontend — React + TypeScript
  - HTML5, CSS3
  - Giao diện khách hàng
  - Trang quản trị Admin
          |
          | HTTP / REST API / JSON / HTTPS
          v
Backend — Java + Spring Boot
  - REST API
  - Spring Security
  - JWT
  - Spring Data JPA / Hibernate
  - Xử lý nghiệp vụ, tài khoản, đơn hàng, thanh toán
          |
          | JPA / Hibernate / JDBC
          v
Database — MySQL
  - Users
  - Products
  - Categories
  - Cart
  - Orders
  - Payments
```

Ngoài ra, hệ thống có thể tích hợp dịch vụ lưu trữ ảnh sản phẩm và cổng
thanh toán trực tuyến. Hai thành phần này chưa cần tích hợp ngay từ đầu.

## 3. Công nghệ đề xuất

  Thành phần          Công nghệ đề xuất             Vai trò
  ------------------- ----------------------------- ------------------------------
  Ngôn ngữ backend    Java 21 LTS                   Xây dựng logic nghiệp vụ
  Backend framework   Spring Boot 3.5.x             Xây dựng REST API
  Bảo mật             Spring Security + JWT         Đăng nhập và phân quyền
  ORM                 Spring Data JPA + Hibernate   Làm việc với database
  Frontend            React + TypeScript            Xây dựng giao diện
  Công cụ frontend    Vite                          Khởi tạo và chạy dự án React
  Giao diện           HTML5 + CSS3                  Bố cục và tạo kiểu
  Database            MySQL 8.x                     Lưu trữ dữ liệu
  Kiểm thử API        Postman + Swagger UI          Kiểm thử và xem tài liệu API
  Quản lý mã nguồn    Git + GitHub                  Quản lý phiên bản
  Hosting             Chưa quyết định               Triển khai sau

**Lưu ý:** React và TypeScript không thay thế HTML, CSS. React giúp xây
dựng giao diện từ các component; TypeScript bổ sung kiểm tra kiểu dữ
liệu cho JavaScript.

Đề xuất dùng Java 21 LTS và Spring Boot 3.x để có nền tảng tương thích
với nhiều thư viện. Trước khi bắt đầu triển khai, cần chốt phiên bản
Spring Boot cụ thể và kiểm tra khả năng tương thích giữa các thành phần.

## 4. Chức năng chính

Website gồm hai khu vực: khách hàng và quản trị viên.

### 4.1. Website dành cho khách hàng

-   Trang chủ, banner và sản phẩm nổi bật.
-   Danh sách điện thoại.
-   Tìm kiếm và lọc theo hãng, giá, RAM, bộ nhớ.
-   Trang chi tiết sản phẩm: ảnh, thông số kỹ thuật và giá bán.
-   Đăng ký, đăng nhập và quản lý thông tin cá nhân.
-   Giỏ hàng và đặt hàng.
-   Thanh toán COD hoặc thanh toán trực tuyến.
-   Theo dõi trạng thái đơn hàng và lịch sử mua hàng.
-   Đánh giá sản phẩm sau khi mua.

### 4.2. Trang quản trị Admin

-   Dashboard thống kê doanh thu và đơn hàng.
-   Quản lý điện thoại, hãng, danh mục và hình ảnh.
-   Quản lý giá bán, tồn kho và phiên bản sản phẩm.
-   Quản lý tài khoản khách hàng và phân quyền.
-   Quản lý đơn hàng, xác nhận đơn và cập nhật trạng thái.
-   Quản lý khuyến mãi và mã giảm giá.
-   Xem báo cáo doanh thu và sản phẩm bán chạy.

Không nên triển khai tất cả chức năng cùng lúc. Hãy hoàn thành từng
nhóm, bắt đầu từ sản phẩm và danh mục, sau đó mới phát triển giỏ hàng và
đặt hàng.

## 5. Thiết kế database MySQL ban đầu

Các bảng dự kiến:

### 5.1. Nhóm tài khoản

-   `users`: tài khoản, email, mật khẩu đã mã hóa, trạng thái và thông
    tin cần thiết khác.

### 5.2. Nhóm sản phẩm

-   `brands`: hãng điện thoại.
-   `categories`: danh mục sản phẩm.
-   `products`: tên, mô tả, hãng, danh mục và thông tin sản phẩm chung.
-   `product_variants`: phiên bản theo màu sắc, RAM, dung lượng, giá và
    tồn kho.
-   `product_images`: hình ảnh của sản phẩm hoặc phiên bản sản phẩm.

### 5.3. Nhóm mua hàng

-   `carts`: giỏ hàng.
-   `cart_items`: các sản phẩm và số lượng trong giỏ.
-   `orders`: thông tin đơn hàng, người mua, địa chỉ giao hàng, tổng
    tiền và trạng thái.
-   `order_items`: các mặt hàng trong đơn, số lượng và giá tại thời điểm
    đặt hàng.
-   `payments`: phương thức thanh toán, số tiền, trạng thái và mã giao
    dịch.

### 5.4. Nhóm đánh giá và khuyến mãi

-   `reviews`: đánh giá sản phẩm.
-   `coupons`: mã giảm giá và điều kiện áp dụng.

### 5.5. Lưu ý thiết kế dữ liệu

Nên tách `products` và `product_variants`. Ví dụ, một mẫu điện thoại có
thể có nhiều màu sắc và dung lượng. Mỗi phiên bản có thể có giá bán hoặc
số lượng tồn kho riêng.

Đơn hàng cần lưu lại giá bán tại thời điểm mua để việc thay đổi giá sản
phẩm sau này không làm sai lịch sử đơn hàng. Mật khẩu phải được băm bằng
cơ chế phù hợp như BCrypt; tuyệt đối không lưu mật khẩu dạng văn bản
thuần.

Thiết kế trên là bản khởi đầu. Trước khi viết migration hoặc tạo bảng
chính thức, cần rà soát quan hệ, khóa chính/khóa ngoại, ràng buộc duy
nhất, kiểu dữ liệu tiền tệ, chỉ mục và quy tắc quản lý tồn kho.

## 6. Cấu trúc thư mục dự kiến

### 6.1. Backend --- Spring Boot

``` text
phone-store-backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/phonestore/
│       │       ├── config/
│       │       ├── security/
│       │       ├── common/
│       │       │   ├── exception/
│       │       │   └── response/
│       │       ├── auth/
│       │       ├── user/
│       │       ├── brand/
│       │       ├── category/
│       │       ├── product/
│       │       ├── cart/
│       │       ├── order/
│       │       ├── payment/
│       │       └── review/
│       └── resources/
│           ├── application.yml
│           └── db/migration/
├── pom.xml
└── README.md
```

Mỗi module nghiệp vụ như `product` hoặc `order` có thể chứa các lớp
`controller`, `service`, `repository`, `entity` và `dto` khi cần. Không
nên dồn toàn bộ logic nghiệp vụ vào Controller.

Có thể sử dụng Flyway để quản lý các phiên bản thay đổi database thông
qua migration. Cần giữ cấu hình bí mật như mật khẩu database và JWT
secret trong biến môi trường khi triển khai; không commit thông tin bí
mật lên GitHub.

### 6.2. Frontend --- React + TypeScript

``` text
phone-store-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetail/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Account/
│   │   └── Admin/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   ├── routes/
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

Frontend và backend nên là hai dự án riêng biệt. Có thể đặt trong cùng
một GitHub repository hoặc sử dụng hai repository tùy cách làm việc cá
nhân/nhóm.

## 7. Hosting và triển khai

Chưa cần quyết định hosting ngay. Trước tiên, phát triển và kiểm thử hệ
thống trên máy tính cá nhân.

Khi chuẩn bị triển khai lên Internet, cần lựa chọn riêng cho frontend,
backend, database và nơi lưu ảnh.

  Thành phần            Hướng triển khai
  --------------------- ------------------------------------------
  Frontend React        Dịch vụ static hosting hoặc CDN
  Backend Spring Boot   Dịch vụ chạy Java hoặc VPS
  MySQL                 MySQL managed database hoặc cài trên VPS
  Ảnh sản phẩm          Object storage hoặc dịch vụ quản lý ảnh
  Domain và HTTPS       Mua domain và cấu hình HTTPS

Khi chọn hosting, cân nhắc chi phí, độ ổn định, khả năng kết nối giữa
backend và database, backup dữ liệu và quy trình triển khai phiên bản
mới. Với website có thanh toán, không nên chỉ chọn dịch vụ rẻ nhất mà bỏ
qua bảo mật và độ tin cậy.

## 8. Lộ trình triển khai

### Giai đoạn 1 --- Khởi tạo dự án

-   Cài đặt JDK, Maven, Node.js và MySQL.
-   Tạo hai project backend và frontend.
-   Cấu hình ứng dụng và kết nối MySQL.
-   Đẩy code ban đầu lên GitHub.

### Giai đoạn 2 --- Database và API sản phẩm

-   Thiết kế bảng hãng, danh mục, sản phẩm, phiên bản và ảnh.
-   Xây dựng API lấy danh sách sản phẩm.
-   Xây dựng API tìm kiếm, lọc và xem chi tiết sản phẩm.
-   Kiểm thử API bằng Postman hoặc Swagger UI.

### Giai đoạn 3 --- Giao diện React

-   Xây dựng trang chủ.
-   Xây dựng danh sách điện thoại và bộ lọc.
-   Xây dựng trang chi tiết sản phẩm.
-   Kết nối dữ liệu thực từ Spring Boot.

### Giai đoạn 4 --- Tài khoản và bảo mật

-   Đăng ký và đăng nhập.
-   Băm mật khẩu.
-   Xác thực bằng JWT.
-   Phân quyền USER và ADMIN.
-   Bảo vệ các API yêu cầu đăng nhập hoặc quyền quản trị.

### Giai đoạn 5 --- Giỏ hàng và đặt hàng

-   Xử lý thêm, sửa và xóa sản phẩm trong giỏ.
-   Kiểm tra số lượng và tồn kho.
-   Xây dựng luồng đặt hàng.
-   Lưu địa chỉ giao hàng, giá tại thời điểm mua và trạng thái đơn hàng.

### Giai đoạn 6 --- Admin và thanh toán

-   Quản lý sản phẩm và tồn kho.
-   Quản lý đơn hàng.
-   Xây dựng giao diện quản trị.
-   Tích hợp thanh toán sau khi luồng đặt hàng cơ bản hoạt động ổn định.

### Giai đoạn 7 --- Kiểm thử và triển khai

-   Kiểm thử API và các luồng nghiệp vụ.
-   Xử lý lỗi và kiểm tra bảo mật.
-   Cấu hình môi trường production.
-   Thiết lập backup database.
-   Triển khai website lên hosting.

Đây là thứ tự triển khai dự kiến; có thể điều chỉnh tùy mục tiêu, thời
gian và trình độ của người thực hiện.

## 9. Thông tin cần chốt trước khi bắt đầu

Trước khi triển khai, cần làm rõ các điểm sau:

1.  **Mục tiêu dự án**
    -   Làm đồ án/portfolio để học và đưa vào CV.
    -   Xây dựng website để bán hàng thực tế.
    -   Thực hành để học Spring Boot và React.
2.  **Trình độ hiện tại**
    -   Mới học Java và React.
    -   Biết Java cơ bản, chưa làm Spring Boot nhiều.
    -   Đã từng làm dự án Spring Boot.
    -   Đã biết cả Spring Boot và React.
3.  **Cách làm việc**
    -   Làm một mình.
    -   Làm theo nhóm.
4.  **Thanh toán**
    -   Chỉ cần COD trước.
    -   COD và dự kiến thêm thanh toán online.
    -   Cần thanh toán online ngay từ đầu.

## 10. Yêu cầu khi sử dụng tài liệu này với Antigravity

Hãy sử dụng tài liệu này làm bản định hướng ban đầu cho dự án website
bán điện thoại.

-   Đọc toàn bộ tài liệu trước khi tạo hoặc sửa file.
-   Không tạo toàn bộ hệ thống trong một lần; triển khai theo từng giai
    đoạn nhỏ.
-   Trước khi thay đổi code hiện có, kiểm tra cấu trúc và nội dung file
    hiện tại.
-   Giải thích ngắn gọn mục đích của mỗi thay đổi.
-   Sau mỗi giai đoạn, chạy build hoặc test phù hợp và báo cáo kết quả
    thực tế.
-   Không tuyên bố một chức năng đã hoạt động nếu chưa kiểm thử.
-   Không tự ý đưa thông tin bí mật vào source code hoặc GitHub.
-   Không quyết định hosting, cổng thanh toán hoặc thư viện lớn khi chưa
    có đủ thông tin.
-   Nếu cần đưa ra quyết định kiến trúc ảnh hưởng lớn, nêu phương án và
    lý do trước khi thực hiện.
-   Giữ API có cấu trúc nhất quán, xử lý lỗi tập trung và phân quyền ở
    backend; không dựa riêng vào việc ẩn nút ở frontend để bảo vệ chức
    năng Admin.
-   Ưu tiên một phiên bản tối thiểu có thể chạy được (MVP), sau đó mới
    mở rộng.
-   Nếu người dùng đang học, hướng dẫn theo từng bước cụ thể, chỉ rõ
    file nào cần tạo/sửa và cách kiểm tra.

### Việc đầu tiên cần thực hiện

Bắt đầu bằng việc kiểm tra môi trường phát triển hiện tại và đề xuất các
bước khởi tạo tối thiểu:

1.  Kiểm tra phiên bản Java, Maven, Node.js và MySQL.
2.  Chốt phiên bản Spring Boot và cấu hình dự án tương thích.
3.  Tạo cấu trúc backend Spring Boot và frontend React + TypeScript bằng
    Vite.
4.  Tạo database MySQL cho dự án.
5.  Cấu hình kết nối backend với MySQL qua biến môi trường hoặc cấu hình
    local không được commit bí mật.
6.  Chạy thử backend và frontend, xác nhận cả hai khởi động thành công.
7.  Chưa triển khai hosting hoặc thanh toán online ở giai đoạn đầu.
