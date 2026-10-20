package com.phonestore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phonestore.auth.LoginRequest;
import com.phonestore.order.Order;
import com.phonestore.order.OrderRepository;
import com.phonestore.order.OrderStatus;
import com.phonestore.order.UpdateOrderStatusRequest;
import com.phonestore.product.CreateProductRequest;
import com.phonestore.product.CreateVariantRequest;
import com.phonestore.product.ProductVariant;
import com.phonestore.product.ProductVariantRepository;
import com.phonestore.product.UpdateStockRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    private String getAdminToken() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "admin123");
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString())
                .path("data").path("token").asText();
    }

    private String getUserToken() throws Exception {
        LoginRequest loginRequest = new LoginRequest("user", "user123");
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString())
                .path("data").path("token").asText();
    }

    @Test
    @DisplayName("Từ chối người dùng thường (ROLE_USER) hoặc khách không có quyền truy cập /api/admin/**")
    void shouldRejectNonAdminUsersFromAdminEndpoints() throws Exception {
        // 1. Không có token -> 403 Forbidden
        mockMvc.perform(get("/api/admin/dashboard"))
                .andExpect(status().isForbidden());

        // 2. Token của ROLE_USER -> 403 Forbidden
        String userToken = getUserToken();
        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Quản trị viên (ROLE_ADMIN) xem bảng điều khiển doanh thu và tồn kho thành công")
    void shouldAllowAdminToGetDashboardStats() throws Exception {
        String adminToken = getAdminToken();

        mockMvc.perform(get("/api/admin/dashboard")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.totalOrders", greaterThanOrEqualTo(0)))
                .andExpect(jsonPath("$.data.totalProducts", greaterThan(0)));
    }

    @Test
    @DisplayName("Quản trị viên cập nhật trạng thái đơn hàng sang CONFIRMED")
    void shouldAllowAdminToUpdateOrderStatus() throws Exception {
        String adminToken = getAdminToken();
        Order order = orderRepository.findAll().get(0);

        UpdateOrderStatusRequest updateReq = new UpdateOrderStatusRequest(OrderStatus.CONFIRMED);

        mockMvc.perform(put("/api/admin/orders/" + order.getId() + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("CONFIRMED")));
    }

    @Test
    @DisplayName("Quản trị viên cập nhật nhanh tồn kho và giá bán phiên bản")
    void shouldAllowAdminToUpdateVariantStock() throws Exception {
        String adminToken = getAdminToken();
        ProductVariant variant = variantRepository.findAll().get(0);

        UpdateStockRequest stockReq = new UpdateStockRequest(88, new BigDecimal("19990000"));

        mockMvc.perform(put("/api/admin/products/variants/" + variant.getId() + "/stock")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(stockReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.stockQuantity", is(88)))
                .andExpect(jsonPath("$.data.price", notNullValue()));
    }

    @Test
    @DisplayName("Quản trị viên tạo mới sản phẩm điện thoại kèm phiên bản thành công")
    void shouldAllowAdminToCreateNewProduct() throws Exception {
        String adminToken = getAdminToken();

        CreateVariantRequest varReq = new CreateVariantRequest(
                "Đen Vũ Trụ",
                "#111827",
                "12GB",
                "512GB",
                new BigDecimal("28990000"),
                new BigDecimal("32990000"),
                20,
                null,
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"
        );

        CreateProductRequest prodReq = new CreateProductRequest(
                "PhoneStore Pro Max 2026 " + System.currentTimeMillis() % 10000,
                1L, // Apple
                1L, // Flagship
                "Mẫu điện thoại thử nghiệm do quản trị viên tạo mới.",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
                "6.8 inch OLED 120Hz",
                "NextGen Bionic A19",
                "5000 mAh 45W",
                "200MP + 50MP + 12MP",
                "Android 15 / iOS 19",
                true,
                List.of(varReq)
        );

        mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(prodReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", containsString("PhoneStore Pro Max 2026")))
                .andExpect(jsonPath("$.data.variants", hasSize(1)));
    }

    @Test
    @DisplayName("Khởi tạo mã VietQR động chuẩn Napas247 cho đơn hàng")
    void shouldGenerateVietQrSuccessfully() throws Exception {
        Order order = orderRepository.findAll().get(0);

        mockMvc.perform(get("/api/payment/vietqr/" + order.getOrderCode())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.qrImageUrl", containsString("vietqr.io")))
                .andExpect(jsonPath("$.data.transferContent", is(order.getOrderCode())));
    }
}
