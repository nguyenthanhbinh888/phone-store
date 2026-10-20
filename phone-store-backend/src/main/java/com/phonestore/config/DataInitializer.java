package com.phonestore.config;

import com.phonestore.brand.Brand;
import com.phonestore.brand.BrandRepository;
import com.phonestore.category.Category;
import com.phonestore.category.CategoryRepository;
import com.phonestore.product.Product;
import com.phonestore.product.ProductImage;
import com.phonestore.product.ProductRepository;
import com.phonestore.product.ProductVariant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.phonestore.user.Role;
import com.phonestore.user.User;
import com.phonestore.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.phonestore.review.Review;
import com.phonestore.review.ReviewRepository;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

        private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

        private final BrandRepository brandRepository;
        private final CategoryRepository categoryRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;
        private final ReviewRepository reviewRepository;
        private final PasswordEncoder passwordEncoder;

        public DataInitializer(BrandRepository brandRepository,
                        CategoryRepository categoryRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        ReviewRepository reviewRepository,
                        PasswordEncoder passwordEncoder) {
                this.brandRepository = brandRepository;
                this.categoryRepository = categoryRepository;
                this.productRepository = productRepository;
                this.userRepository = userRepository;
                this.reviewRepository = reviewRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        @Transactional
        public void run(String... args) {
                // Khởi tạo người dùng mặc định nếu chưa có
                if (userRepository.count() == 0) {
                        log.info("Khởi tạo tài khoản quản trị viên và người dùng mặc định...");
                        userRepository.save(User.builder()
                                        .username("admin")
                                        .email("admin@phonestore.vn")
                                        .password(passwordEncoder.encode("admin123"))
                                        .fullName("Quản trị viên PhoneStore")
                                        .phoneNumber("0900000001")
                                        .address("Hà Nội, Việt Nam")
                                        .role(Role.ROLE_ADMIN)
                                        .active(true)
                                        .build());

                        userRepository.save(User.builder()
                                        .username("user")
                                        .email("user@phonestore.vn")
                                        .password(passwordEncoder.encode("user123"))
                                        .fullName("Nguyễn Văn A (Khách hàng)")
                                        .phoneNumber("0900000002")
                                        .address("TP. Hồ Chí Minh, Việt Nam")
                                        .role(Role.ROLE_USER)
                                        .active(true)
                                        .build());
                        log.info("Đã khởi tạo thành công tài khoản admin (admin/admin123) và user (user/user123).");
                }

                if (productRepository.count() > 0) {
                        log.info("Dữ liệu sản phẩm đã tồn tại, kiểm tra nạp đánh giá mẫu...");
                        seedReviewsIfEmpty();
                        return;
                }

                log.info("Bắt đầu nạp dữ liệu mẫu ban đầu cho điện thoại, danh mục và thương hiệu...");

                // 1. Tạo Thương hiệu (Brands)
                Brand apple = brandRepository.save(Brand.builder()
                                .name("Apple")
                                .slug("apple")
                                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg")
                                .description("Hãng công nghệ hàng đầu thế giới với hệ sinh thái iPhone, iPad, Mac.")
                                .build());

                Brand samsung = brandRepository.save(Brand.builder()
                                .name("Samsung")
                                .slug("samsung")
                                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg")
                                .description("Tập đoàn điện tử hàng đầu Hàn Quốc, nổi tiếng với dòng flagship Galaxy.")
                                .build());

                Brand xiaomi = brandRepository.save(Brand.builder()
                                .name("Xiaomi")
                                .slug("xiaomi")
                                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg")
                                .description("Đột phá công nghệ với hiệu năng mạnh mẽ và camera Leica đỉnh cao.")
                                .build());

                Brand oppo = brandRepository.save(Brand.builder()
                                .name("OPPO")
                                .slug("oppo")
                                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg")
                                .description("Thương hiệu smartphone tập trung vào camera chân dung và sạc nhanh SuperVOOC.")
                                .build());

                // 2. Tạo Danh mục (Categories)
                Category flagship = categoryRepository.save(Category.builder()
                                .name("Flagship Cao Cấp")
                                .slug("flagship")
                                .description("Những mẫu điện thoại đỉnh cao nhất với công nghệ tiên phong và vật liệu sang trọng.")
                                .build());

                Category midRange = categoryRepository.save(Category.builder()
                                .name("Tầm Trung Nổi Bật")
                                .slug("tam-trung")
                                .description("Cân bằng hoàn hảo giữa hiệu năng, thời lượng pin và mức giá hợp lý.")
                                .build());

                Category budget = categoryRepository.save(Category.builder()
                                .name("Phổ Thông Giá Rẻ")
                                .slug("pho-thong")
                                .description("Điện thoại thông minh giá tốt, đáp ứng mượt mà mọi nhu cầu liên lạc và giải trí cơ bản.")
                                .build());

                // 3. Tạo Sản phẩm & Biến thể mẫu (Products & Variants)

                // Sản phẩm 1: iPhone 16 Pro Max
                Product iphone16ProMax = Product.builder()
                                .name("iPhone 16 Pro Max")
                                .slug("iphone-16-pro-max")
                                .brand(apple)
                                .category(flagship)
                                .thumbnailUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80")
                                .screen("6.9 inch Super Retina XDR OLED, 120Hz ProMotion")
                                .chipset("Apple A18 Pro (3nm)")
                                .battery("4685 mAh, Sạc nhanh 45W, MagSafe")
                                .camera("Chính 48MP Fusion, Siêu rộng 48MP, Tele 12MP zoom 5x")
                                .os("iOS 18")
                                .isFeatured(true)
                                .isActive(true)
                                .description("iPhone 16 Pro Max với thiết kế titan bền nhẹ tuyệt mỹ, màn hình lớn nhất từng có 6.9 inch, nút Điều Khiển Camera hoàn toàn mới và chip A18 Pro đỉnh cao cho trải nghiệm Apple Intelligence.")
                                .build();

                iphone16ProMax.addVariant(ProductVariant.builder()
                                .color("Titan Sa Mạc")
                                .colorCode("#c2bcaf")
                                .ram("8GB")
                                .storage("256GB")
                                .price(new BigDecimal("34990000"))
                                .originalPrice(new BigDecimal("36990000"))
                                .stockQuantity(50)
                                .sku("IP16PM-256-DESERT")
                                .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80")
                                .build());

                iphone16ProMax.addVariant(ProductVariant.builder()
                                .color("Titan Sa Mạc")
                                .colorCode("#c2bcaf")
                                .ram("8GB")
                                .storage("512GB")
                                .price(new BigDecimal("40990000"))
                                .originalPrice(new BigDecimal("42990000"))
                                .stockQuantity(30)
                                .sku("IP16PM-512-DESERT")
                                .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80")
                                .build());

                iphone16ProMax.addVariant(ProductVariant.builder()
                                .color("Titan Đen")
                                .colorCode("#3b3a38")
                                .ram("8GB")
                                .storage("256GB")
                                .price(new BigDecimal("34990000"))
                                .originalPrice(new BigDecimal("36990000"))
                                .stockQuantity(45)
                                .sku("IP16PM-256-BLACK")
                                .imageUrl("https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80")
                                .build());

                iphone16ProMax.addImage(ProductImage.builder()
                                .imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80")
                                .isPrimary(true)
                                .displayOrder(1)
                                .build());

                productRepository.save(iphone16ProMax);

                // Sản phẩm 2: Samsung Galaxy S24 Ultra
                Product s24Ultra = Product.builder()
                                .name("Samsung Galaxy S24 Ultra")
                                .slug("samsung-galaxy-s24-ultra")
                                .brand(samsung)
                                .category(flagship)
                                .thumbnailUrl("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80")
                                .screen("6.8 inch Dynamic AMOLED 2X, QHD+, 120Hz, 2600 nits")
                                .chipset("Snapdragon 8 Gen 3 for Galaxy (4nm)")
                                .battery("5000 mAh, Sạc siêu nhanh 45W")
                                .camera("Chính 200MP, Tele 50MP 5x, Tele 10MP 3x, Siêu rộng 12MP")
                                .os("Android 14, One UI 6.1 (Galaxy AI)")
                                .isFeatured(true)
                                .isActive(true)
                                .description("Khám phá quyền năng Galaxy AI trên Galaxy S24 Ultra với khung viền Titan sang trọng, bút S Pen tích hợp, màn hình phẳng chống chói Corning Gorilla Armor và hệ thống camera 200MP siêu zoom.")
                                .build();

                s24Ultra.addVariant(ProductVariant.builder()
                                .color("Xám Titan")
                                .colorCode("#696a6c")
                                .ram("12GB")
                                .storage("256GB")
                                .price(new BigDecimal("28990000"))
                                .originalPrice(new BigDecimal("31990000"))
                                .stockQuantity(40)
                                .sku("S24U-256-GRAY")
                                .imageUrl("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80")
                                .build());

                s24Ultra.addVariant(ProductVariant.builder()
                                .color("Đen Titan")
                                .colorCode("#2a2b2c")
                                .ram("12GB")
                                .storage("512GB")
                                .price(new BigDecimal("32990000"))
                                .originalPrice(new BigDecimal("35990000"))
                                .stockQuantity(25)
                                .sku("S24U-512-BLACK")
                                .imageUrl("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80")
                                .build());

                s24Ultra.addImage(ProductImage.builder()
                                .imageUrl("https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80")
                                .isPrimary(true)
                                .displayOrder(1)
                                .build());

                productRepository.save(s24Ultra);

                // Sản phẩm 3: Xiaomi 14 Ultra
                Product xiaomi14Ultra = Product.builder()
                                .name("Xiaomi 14 Ultra")
                                .slug("xiaomi-14-ultra")
                                .brand(xiaomi)
                                .category(flagship)
                                .thumbnailUrl("https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80")
                                .screen("6.73 inch LTPO AMOLED, WQHD+, 120Hz, Dolby Vision")
                                .chipset("Snapdragon 8 Gen 3 (4nm)")
                                .battery("5000 mAh, Sạc HyperCharge 90W có dây, 80W không dây")
                                .camera("Hệ 4 camera Leica 50MP, cảm biến chính LYT-900 1-inch")
                                .os("Xiaomi HyperOS (Android 14)")
                                .isFeatured(true)
                                .isActive(true)
                                .description("Kiệt tác nhiếp ảnh di động với cụm 4 ống kính quang học Leica Summilux, cảm biến 1-inch thế hệ mới và thiết kế lưng da thuần chay chuẩn phong cách máy ảnh cổ điển.")
                                .build();

                xiaomi14Ultra.addVariant(ProductVariant.builder()
                                .color("Đen Huyền Bí")
                                .colorCode("#1c1c1c")
                                .ram("16GB")
                                .storage("512GB")
                                .price(new BigDecimal("26990000"))
                                .originalPrice(new BigDecimal("29990000"))
                                .stockQuantity(20)
                                .sku("MI14U-512-BLACK")
                                .imageUrl("https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80")
                                .build());

                xiaomi14Ultra.addImage(ProductImage.builder()
                                .imageUrl("https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80")
                                .isPrimary(true)
                                .displayOrder(1)
                                .build());

                productRepository.save(xiaomi14Ultra);

                // Sản phẩm 4: Samsung Galaxy A55 5G
                Product a55 = Product.builder()
                                .name("Samsung Galaxy A55 5G")
                                .slug("samsung-galaxy-a55-5g")
                                .brand(samsung)
                                .category(midRange)
                                .thumbnailUrl("https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80")
                                .screen("6.6 inch Super AMOLED, FHD+, 120Hz, HDR10+")
                                .chipset("Exynos 1480 (4nm) với GPU AMD Xclipse 530")
                                .battery("5000 mAh, Sạc nhanh 25W")
                                .camera("Chính 50MP OIS, Siêu rộng 12MP, Macro 5MP")
                                .os("Android 14, One UI 6.1")
                                .isFeatured(false)
                                .isActive(true)
                                .description("Galaxy A55 5G nâng tầm với khung kim loại vát phẳng thời thượng, mặt lưng kính Gorilla Glass Victus+ cùng khả năng kháng nước bụi IP67 chuẩn mực.")
                                .build();

                a55.addVariant(ProductVariant.builder()
                                .color("Xanh Iceblue")
                                .colorCode("#c0dbeb")
                                .ram("8GB")
                                .storage("128GB")
                                .price(new BigDecimal("9490000"))
                                .originalPrice(new BigDecimal("9990000"))
                                .stockQuantity(60)
                                .sku("A55-128-BLUE")
                                .imageUrl("https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80")
                                .build());

                a55.addVariant(ProductVariant.builder()
                                .color("Xanh Iceblue")
                                .colorCode("#c0dbeb")
                                .ram("8GB")
                                .storage("256GB")
                                .price(new BigDecimal("10490000"))
                                .originalPrice(new BigDecimal("11490000"))
                                .stockQuantity(40)
                                .sku("A55-256-BLUE")
                                .imageUrl("https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80")
                                .build());

                a55.addImage(ProductImage.builder()
                                .imageUrl("https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80")
                                .isPrimary(true)
                                .displayOrder(1)
                                .build());

                productRepository.save(a55);

                // Sản phẩm 5: OPPO Reno12 5G
                Product reno12 = Product.builder()
                                .name("OPPO Reno12 5G")
                                .slug("oppo-reno-12-5g")
                                .brand(oppo)
                                .category(midRange)
                                .thumbnailUrl("https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80")
                                .screen("6.7 inch AMOLED cong 3D viền siêu mỏng, 120Hz")
                                .chipset("MediaTek Dimensity 7300-Energy (4nm)")
                                .battery("5000 mAh, Sạc siêu nhanh SuperVOOC 80W")
                                .camera("Chính 50MP Sony LYT-600 OIS, Chân dung AI, Siêu rộng 8MP")
                                .os("ColorOS 14 (Android 14)")
                                .isFeatured(false)
                                .isActive(true)
                                .description("Chuyên gia chân dung AI với thiết kế dòng chảy bạc tương lai, độ bền chuẩn quân đội và các tính năng AI Studio chỉnh sửa ảnh ma thuật.")
                                .build();

                reno12.addVariant(ProductVariant.builder()
                                .color("Bạc Vũ Trụ")
                                .colorCode("#dcdde1")
                                .ram("12GB")
                                .storage("256GB")
                                .price(new BigDecimal("11990000"))
                                .originalPrice(new BigDecimal("12990000"))
                                .stockQuantity(30)
                                .sku("RENO12-256-SILVER")
                                .imageUrl("https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80")
                                .build());

                reno12.addImage(ProductImage.builder()
                                .imageUrl("https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80")
                                .isPrimary(true)
                                .displayOrder(1)
                                .build());

                productRepository.save(reno12);

                // Sản phẩm 6: Xiaomi Redmi Note 13 Pro 5G
                Product redmiNote13Pro = Product.builder()
                                .name("Xiaomi Redmi Note 13 Pro 5G")
                                .slug("xiaomi-redmi-note-13-pro-5g")
                                .brand(xiaomi)
                                .category(budget)
                                .thumbnailUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80")
                                .screen("6.67 inch AMOLED 1.5K CrystalRes, 120Hz, 1800 nits")
                                .chipset("Snapdragon 7s Gen 2 (4nm)")
                                .battery("5100 mAh, Sạc nhanh turbo 67W")
                                .camera("Chính 200MP siêu nét OIS, Siêu rộng 8MP, Macro 2MP")
                                .os("MIUI 14 (nâng cấp HyperOS)")
                                .isFeatured(false)
                                .isActive(true)
                                .description("Mẫu điện thoại quốc dân sở hữu camera siêu phân giải 200MP, màn hình AMOLED 1.5K sắc nét hàng đầu phân khúc phổ thông.")
                                .build();

                redmiNote13Pro.addVariant(ProductVariant.builder()
                                .color("Đen Bán Dạ")
                                .colorCode("#212121")
                                .ram("8GB")
                                .storage("256GB")
                                .price(new BigDecimal("8490000"))
                                .originalPrice(new BigDecimal("8990000"))
                                .stockQuantity(55)
                                .sku("NOTE13P-256-BLACK")
                                .imageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80")
                                .build());

                redmiNote13Pro.addImage(ProductImage.builder()
                                .imageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80")
                                .isPrimary(true)
                                .displayOrder(1)
                                .build());

                productRepository.save(redmiNote13Pro);

                log.info("Nạp dữ liệu mẫu ban đầu thành công! Đã tạo {} thương hiệu, {} danh mục và {} điện thoại mẫu.",
                                brandRepository.count(), categoryRepository.count(), productRepository.count());

                seedReviewsIfEmpty();
        }

        private void seedReviewsIfEmpty() {
                if (reviewRepository.count() == 0 && userRepository.count() > 0 && productRepository.count() > 0) {
                        log.info("Khởi tạo đánh giá mẫu cho sản phẩm...");
                        User user = userRepository.findByUsername("user").orElse(null);
                        User admin = userRepository.findByUsername("admin").orElse(null);
                        List<Product> products = productRepository.findAll();
                        if (!products.isEmpty() && user != null) {
                                Product p1 = products.get(0);
                                reviewRepository.save(new Review(null, p1, user, 5, "Máy dùng rất mượt, pin trâu, camera chụp đêm cực kỳ sắc nét. Rất hài lòng!", null, null));
                                if (admin != null) {
                                        reviewRepository.save(new Review(null, p1, admin, 5, "Sản phẩm chính hãng chất lượng cao, đóng gói rất cẩn thận và giao nhanh.", null, null));
                                }
                                if (products.size() > 1) {
                                        Product p2 = products.get(1);
                                        reviewRepository.save(new Review(null, p2, user, 4, "Màn hình rất đẹp, thiết kế sang trọng cầm đầm tay. Điểm trừ nhẹ là máy hơi ấm khi chơi game nặng liên tục.", null, null));
                                }
                                log.info("Đã tạo mẫu thành công {} đánh giá sản phẩm.", reviewRepository.count());
                        }
                }
        }
}
