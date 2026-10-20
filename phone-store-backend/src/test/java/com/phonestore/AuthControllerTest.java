package com.phonestore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phonestore.auth.LoginRequest;
import com.phonestore.auth.RegisterRequest;
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
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Đăng nhập thành công với tài khoản Quản trị viên (admin/admin123)")
    void shouldLoginSuccessfullyWithAdminAccount() throws Exception {
        LoginRequest request = new LoginRequest("admin", "admin123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.username", is("admin")))
                .andExpect(jsonPath("$.data.role", is("ROLE_ADMIN")));
    }

    @Test
    @DisplayName("Đăng nhập thành công với tài khoản Khách hàng (user/user123)")
    void shouldLoginSuccessfullyWithUserAccount() throws Exception {
        LoginRequest request = new LoginRequest("user", "user123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.username", is("user")))
                .andExpect(jsonPath("$.data.role", is("ROLE_USER")));
    }

    @Test
    @DisplayName("Đăng nhập thất bại khi sai mật khẩu")
    void shouldFailLoginWithIncorrectPassword() throws Exception {
        LoginRequest request = new LoginRequest("admin", "wrong_password_999");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("không chính xác")));
    }

    @Test
    @DisplayName("Đăng ký tài khoản người dùng mới thành công")
    void shouldRegisterNewUser() throws Exception {
        String uniqueSuffix = String.valueOf(System.currentTimeMillis() % 100000);
        RegisterRequest request = new RegisterRequest(
                "newuser_" + uniqueSuffix,
                "newuser_" + uniqueSuffix + "@example.com",
                "password123",
                "Người Dùng Mới",
                "0988776655",
                "123 Đường ABC, Quận 1, TP HCM"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.username", is("newuser_" + uniqueSuffix)))
                .andExpect(jsonPath("$.data.role", is("ROLE_USER")));
    }

    @Test
    @DisplayName("Lấy thông tin tài khoản hiện tại qua JWT Token (/api/auth/me)")
    void shouldGetMeWithValidToken() throws Exception {
        LoginRequest loginRequest = new LoginRequest("user", "user123");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).path("data").path("token").asText();

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", is("user")))
                .andExpect(jsonPath("$.data.role", is("ROLE_USER")));
    }

    @Test
    @DisplayName("Từ chối truy cập /api/auth/me khi không có token")
    void shouldRejectMeWithoutToken() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }
}
