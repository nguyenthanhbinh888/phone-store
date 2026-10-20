package com.phonestore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phonestore.auth.LoginRequest;
import com.phonestore.order.CreateOrderItemRequest;
import com.phonestore.order.CreateOrderRequest;
import com.phonestore.order.PaymentMethod;
import com.phonestore.product.ProductVariant;
import com.phonestore.product.ProductVariantRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Test
    @DisplayName("Đặt hàng thành công, trừ tồn kho và sinh mã đơn hàng chuẩn")
    void shouldCreateOrderSuccessfully() throws Exception {
        ProductVariant variant = variantRepository.findAll().stream()
                .filter(v -> v.getStockQuantity() >= 5)
                .findFirst()
                .orElseThrow();

        int initialStock = variant.getStockQuantity();

        CreateOrderRequest request = new CreateOrderRequest(
                "Trần Văn Khách",
                "0987654321",
                "khachhang@example.com",
                "Số 88 Phố Huế, Hoàn Kiếm, Hà Nội",
                "Giao hàng giờ hành chính",
                PaymentMethod.COD,
                List.of(new CreateOrderItemRequest(variant.getId(), 2))
        );

        MvcResult result = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.orderCode", startsWith("ORD-")))
                .andExpect(jsonPath("$.data.status", is("PENDING")))
                .andExpect(jsonPath("$.data.paymentMethod", is("COD")))
                .andExpect(jsonPath("$.data.paymentStatus", is("UNPAID")))
                .andExpect(jsonPath("$.data.items", hasSize(1)))
                .andExpect(jsonPath("$.data.items[0].quantity", is(2)))
                .andReturn();

        // Kiểm tra tồn kho đã bị trừ đi 2
        ProductVariant updatedVariant = variantRepository.findById(variant.getId()).orElseThrow();
        assertEquals(initialStock - 2, updatedVariant.getStockQuantity());
    }

    @Test
    @DisplayName("Báo lỗi khi đặt mua số lượng vượt quá tồn kho thực tế")
    void shouldFailOrderWhenStockIsInsufficient() throws Exception {
        ProductVariant variant = variantRepository.findAll().get(0);

        CreateOrderRequest request = new CreateOrderRequest(
                "Khách Mua Sỉ",
                "0911223344",
                "muasi@example.com",
                "Đà Nẵng",
                "Giao gấp",
                PaymentMethod.COD,
                List.of(new CreateOrderItemRequest(variant.getId(), 99999))
        );

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("không đủ số lượng")));
    }

    @Test
    @DisplayName("Tra cứu chi tiết đơn hàng theo mã đơn (orderCode)")
    void shouldGetOrderByCode() throws Exception {
        ProductVariant variant = variantRepository.findAll().get(0);

        CreateOrderRequest request = new CreateOrderRequest(
                "Lê Thị Hoa",
                "0933445566",
                "hoa.le@example.com",
                "Quận 1, TP Hồ Chí Minh",
                null,
                PaymentMethod.COD,
                List.of(new CreateOrderItemRequest(variant.getId(), 1))
        );

        MvcResult createResult = mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String responseBody = createResult.getResponse().getContentAsString();
        String orderCode = objectMapper.readTree(responseBody).path("data").path("orderCode").asText();

        mockMvc.perform(get("/api/orders/code/" + orderCode)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.orderCode", is(orderCode)))
                .andExpect(jsonPath("$.data.customerName", is("Lê Thị Hoa")));
    }

    @Test
    @DisplayName("Đặt hàng có đăng nhập, xem lịch sử đơn hàng và hủy đơn khôi phục tồn kho")
    void shouldHandleOrderLifecycleWithAuthentication() throws Exception {
        // 1. Đăng nhập với tài khoản user/user123
        LoginRequest loginRequest = new LoginRequest("user", "user123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .path("data").path("token").asText();

        // 2. Tạo đơn hàng với token
        ProductVariant variant = variantRepository.findAll().stream()
                .filter(v -> v.getStockQuantity() >= 3)
                .findFirst()
                .orElseThrow();
        int stockBefore = variant.getStockQuantity();

        CreateOrderRequest orderReq = new CreateOrderRequest(
                "Nguyễn Văn A (Khách hàng)",
                "0900000002",
                "user@phonestore.vn",
                "TP. Hồ Chí Minh",
                "Test order flow",
                PaymentMethod.COD,
                List.of(new CreateOrderItemRequest(variant.getId(), 1))
        );

        MvcResult orderResult = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderReq)))
                .andExpect(status().isCreated())
                .andReturn();

        long orderId = objectMapper.readTree(orderResult.getResponse().getContentAsString())
                .path("data").path("id").asLong();

        // Kiểm tra tồn kho đã giảm
        assertEquals(stockBefore - 1, variantRepository.findById(variant.getId()).orElseThrow().getStockQuantity());

        // 3. Xem danh sách đơn hàng cá nhân (/api/orders/my-orders)
        mockMvc.perform(get("/api/orders/my-orders")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));

        // 4. Hủy đơn hàng và kiểm tra tồn kho được hoàn trả
        mockMvc.perform(put("/api/orders/" + orderId + "/cancel")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("CANCELLED")));

        // Kiểm tra tồn kho đã được khôi phục nguyên vẹn
        assertEquals(stockBefore, variantRepository.findById(variant.getId()).orElseThrow().getStockQuantity());
    }
}
