package com.phonestore;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Kiểm thử API lấy danh sách thương hiệu (Brands)")
    void shouldGetAllBrands() throws Exception {
        mockMvc.perform(get("/api/brands")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(4))))
                .andExpect(jsonPath("$.data[*].slug", hasItems("apple", "samsung", "xiaomi", "oppo")));
    }

    @Test
    @DisplayName("Kiểm thử API lấy danh sách danh mục (Categories)")
    void shouldGetAllCategories() throws Exception {
        mockMvc.perform(get("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$.data[*].slug", hasItems("flagship", "tam-trung", "pho-thong")));
    }

    @Test
    @DisplayName("Kiểm thử API lấy danh sách sản phẩm phân trang")
    void shouldGetProductsPaged() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.items", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.totalElements", greaterThan(0)));
    }

    @Test
    @DisplayName("Kiểm thử API lấy danh sách sản phẩm nổi bật")
    void shouldGetFeaturedProducts() throws Exception {
        mockMvc.perform(get("/api/products/featured")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].featured", is(true)));
    }

    @Test
    @DisplayName("Kiểm thử API lọc sản phẩm theo hãng Apple")
    void shouldFilterProductsByBrandSlug() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("brandSlug", "apple")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.items[*].brand.slug", everyItem(is("apple"))));
    }

    @Test
    @DisplayName("Kiểm thử API xem chi tiết điện thoại theo Slug iPhone 16 Pro Max")
    void shouldGetProductDetailBySlug() throws Exception {
        mockMvc.perform(get("/api/products/slug/iphone-16-pro-max")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.name", is("iPhone 16 Pro Max")))
                .andExpect(jsonPath("$.data.chipset", containsString("A18 Pro")))
                .andExpect(jsonPath("$.data.variants", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.variants[0].storage", notNullValue()));
    }

    @Test
    @DisplayName("Kiểm thử API trả về 404 khi xem sản phẩm không tồn tại")
    void shouldReturn404WhenProductNotFound() throws Exception {
        mockMvc.perform(get("/api/products/slug/non-existent-phone-slug")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }
}
