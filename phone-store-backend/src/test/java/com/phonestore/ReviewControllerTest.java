package com.phonestore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phonestore.auth.AuthResponse;
import com.phonestore.auth.LoginRequest;
import com.phonestore.common.response.ApiResponse;
import com.phonestore.review.CreateReviewRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String getAuthToken(String username, String password) throws Exception {
        LoginRequest loginRequest = new LoginRequest(username, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(json, ApiResponse.class);
        String dataJson = objectMapper.writeValueAsString(apiResponse.getData());
        AuthResponse authResponse = objectMapper.readValue(dataJson, AuthResponse.class);
        return authResponse.getToken();
    }

    @Test
    @DisplayName("Kiểm thử lấy danh sách đánh giá công khai của sản phẩm (không cần đăng nhập)")
    void shouldGetProductReviewsPublicly() throws Exception {
        mockMvc.perform(get("/api/products/1/reviews")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.averageRating", notNullValue()))
                .andExpect(jsonPath("$.data.totalReviews", notNullValue()))
                .andExpect(jsonPath("$.data.reviews", notNullValue()));
    }

    @Test
    @DisplayName("Kiểm thử gửi đánh giá khi chưa đăng nhập sẽ bị từ chối")
    void shouldRejectReviewWithoutAuth() throws Exception {
        CreateReviewRequest request = new CreateReviewRequest(5, "Đánh giá không đăng nhập");

        mockMvc.perform(post("/api/products/1/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Kiểm thử người dùng đã đăng nhập gửi đánh giá thành công")
    void shouldCreateReviewWithAuth() throws Exception {
        String token = getAuthToken("user", "user123");
        CreateReviewRequest request = new CreateReviewRequest(5, "Sản phẩm dùng rất mượt và thiết kế cao cấp!");

        mockMvc.perform(post("/api/products/1/reviews")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.rating", is(5)))
                .andExpect(jsonPath("$.data.comment", is("Sản phẩm dùng rất mượt và thiết kế cao cấp!")))
                .andExpect(jsonPath("$.data.userName", is("user")));
    }

    @Test
    @DisplayName("Kiểm thử gửi đánh giá với số sao không hợp lệ (> 5) sẽ báo lỗi 400")
    void shouldRejectInvalidRating() throws Exception {
        String token = getAuthToken("user", "user123");
        CreateReviewRequest request = new CreateReviewRequest(6, "Số sao vượt quá giới hạn");

        mockMvc.perform(post("/api/products/1/reviews")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }
}
