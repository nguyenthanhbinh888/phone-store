package com.phonestore;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phonestore.auth.AuthResponse;
import com.phonestore.auth.LoginRequest;
import com.phonestore.common.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UploadControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String getAdminToken() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "admin123");
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
    @DisplayName("Kiểm thử tải ảnh hợp lệ lên máy chủ và truy xuất hình ảnh đã lưu")
    void shouldUploadAndServeImage() throws Exception {
        String token = getAdminToken();

        MockMultipartFile imageFile = new MockMultipartFile(
                "file",
                "test-phone.png",
                MediaType.IMAGE_PNG_VALUE,
                "fake-png-image-content".getBytes()
        );

        MvcResult uploadResult = mockMvc.perform(multipart("/api/upload")
                        .file(imageFile)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.url", startsWith("/api/uploads/")))
                .andExpect(jsonPath("$.data.filename", notNullValue()))
                .andReturn();

        String json = uploadResult.getResponse().getContentAsString();
        ApiResponse<?> apiResponse = objectMapper.readValue(json, ApiResponse.class);
        String dataJson = objectMapper.writeValueAsString(apiResponse.getData());
        java.util.Map<?, ?> map = objectMapper.readValue(dataJson, java.util.Map.class);
        String filename = (String) map.get("filename");

        // Kiểm thử truy xuất file vừa upload
        mockMvc.perform(get("/api/uploads/" + filename))
                .andExpect(status().isOk())
                .andExpect(content().bytes("fake-png-image-content".getBytes()));
    }

    @Test
    @DisplayName("Kiểm thử từ chối tệp không phải định dạng hình ảnh")
    void shouldRejectNonImageFile() throws Exception {
        String token = getAdminToken();

        MockMultipartFile textFile = new MockMultipartFile(
                "file",
                "virus.exe",
                MediaType.APPLICATION_OCTET_STREAM_VALUE,
                "malicious script".getBytes()
        );

        mockMvc.perform(multipart("/api/upload")
                        .file(textFile)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }
}
