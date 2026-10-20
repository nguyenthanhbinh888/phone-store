package com.phonestore.admin;

import com.phonestore.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@Tag(name = "Admin Dashboard API", description = "Các chỉ số doanh thu, đơn hàng và cảnh báo tồn kho dành cho Quản trị viên")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;

    public AdminDashboardController(AdminDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @Operation(summary = "Lấy dữ liệu tổng hợp bảng điều khiển (doanh thu, đơn hàng, tồn kho cảnh báo)")
    public ResponseEntity<ApiResponse<DashboardDto>> getDashboardStats() {
        DashboardDto stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok("Lấy số liệu thống kê quản trị thành công", stats));
    }
}
