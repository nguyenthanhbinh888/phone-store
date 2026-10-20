package com.phonestore.order;

import com.phonestore.common.response.ApiResponse;
import com.phonestore.common.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@Tag(name = "Admin Order API", description = "Các API quản trị danh sách đơn hàng và cập nhật tiến độ giao hàng / thanh toán")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả đơn hàng có phân trang và lọc theo trạng thái")
    public ResponseEntity<ApiResponse<PageResponse<OrderDto>>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<OrderDto> orderPage = orderService.getAllOrdersPaged(status, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách đơn hàng thành công", orderPage));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái vòng đời đơn hàng (Chờ xử lý, Đã xác nhận, Đang giao, Hoàn thành, Đã hủy)")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderDto updatedOrder = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái đơn hàng thành công", updatedOrder));
    }

    @PutMapping("/{id}/payment-status")
    @Operation(summary = "Cập nhật trạng thái thanh toán (Chưa thanh toán, Đã thanh toán, Đã hoàn tiền)")
    public ResponseEntity<ApiResponse<OrderDto>> updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePaymentStatusRequest request
    ) {
        OrderDto updatedOrder = orderService.updatePaymentStatus(id, request.getPaymentStatus());
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thanh toán thành công", updatedOrder));
    }
}
