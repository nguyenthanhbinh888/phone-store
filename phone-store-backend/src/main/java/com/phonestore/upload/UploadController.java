package com.phonestore.upload;

import com.phonestore.common.exception.BadRequestException;
import com.phonestore.common.exception.ResourceNotFoundException;
import com.phonestore.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@Tag(name = "Upload API", description = "Tải lên và phục vụ hình ảnh sản phẩm trực tiếp trên máy chủ")
public class UploadController {

    private final Path uploadDir;

    public UploadController(@Value("${app.upload.dir:./uploads}") String uploadDirStr) {
        this.uploadDir = Paths.get(uploadDirStr).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Không thể khởi tạo thư mục lưu trữ ảnh: " + e.getMessage(), e);
        }
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Tải tập tin ảnh từ máy tính lên máy chủ lưu trữ")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn tập tin hình ảnh để tải lên");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new BadRequestException("Tập tin không hợp lệ! Vui lòng chỉ tải lên định dạng hình ảnh (PNG, JPG, JPEG, WEBP, GIF, SVG)");
        }

        // Tối đa 15MB
        if (file.getSize() > 15 * 1024 * 1024) {
            throw new BadRequestException("Kích thước hình ảnh quá lớn (tối đa 15MB)");
        }

        String originalFilename = StringUtils.cleanPath(Objects.requireNonNullElse(file.getOriginalFilename(), "image.png"));
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        // Tạo tên tệp độc nhất
        String uniqueFilename = UUID.randomUUID() + "_" + System.currentTimeMillis() + extension;

        try {
            Path targetLocation = this.uploadDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/api/uploads/" + uniqueFilename;

            Map<String, String> responseData = new HashMap<>();
            responseData.put("url", fileUrl);
            responseData.put("filename", uniqueFilename);
            responseData.put("originalName", originalFilename);
            responseData.put("contentType", contentType);

            return ResponseEntity.ok(ApiResponse.ok("Tải ảnh lên hệ thống thành công!", responseData));
        } catch (IOException e) {
            throw new RuntimeException("Lỗi trong quá trình lưu trữ hình ảnh: " + e.getMessage(), e);
        }
    }

    @GetMapping("/uploads/{filename:.+}")
    @Operation(summary = "Lấy và hiển thị hình ảnh đã tải lên")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = this.uploadDir.resolve(filename).normalize();

            // Chống tấn công Path Traversal
            if (!filePath.startsWith(this.uploadDir)) {
                throw new BadRequestException("Tên tệp không hợp lệ");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Hình ảnh", "tên tệp", filename);
            }

            String contentType = null;
            try {
                contentType = Files.probeContentType(filePath);
            } catch (IOException ignored) {
            }

            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=2592000") // Cache 30 ngày
                    .body(resource);
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Hình ảnh", "tên tệp", filename);
        }
    }
}
