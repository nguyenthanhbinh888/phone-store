package com.phonestore.order;

import com.phonestore.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Order API", description = "Các API đặt hàng, tra cứu tình trạng đơn hàng và quản lý lịch sử mua hàng")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Tạo đơn hàng mới (hỗ trợ cả khách vãng lai và thành viên đã đăng nhập)")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                                             Authentication authentication) {
        String currentUsername = (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getName()))
                ? authentication.getName()
                : null;

        OrderDto order = orderService.createOrder(request, currentUsername);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Đặt hàng thành công! Mã đơn hàng của bạn là: " + order.getOrderCode(), order));
    }

    @GetMapping("/code/{orderCode}")
    @Operation(summary = "Tra cứu chi tiết đơn hàng theo mã đơn hàng (VD: ORD-20261019-XXXXX)")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByCode(@PathVariable String orderCode) {
        OrderDto order = orderService.getOrderByCode(orderCode);
        return ResponseEntity.ok(ApiResponse.ok("Tra cứu thông tin đơn hàng thành công", order));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết đơn hàng theo ID")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.ok("Lấy chi tiết đơn hàng thành công", order));
    }

    @GetMapping("/my-orders")
    @Operation(summary = "Lấy danh sách lịch sử đơn hàng của người dùng hiện tại")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Vui lòng đăng nhập để xem lịch sử đơn hàng"));
        }

        List<OrderDto> orders = orderService.getMyOrders(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Lấy lịch sử đơn hàng thành công", orders));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Hủy đơn hàng đang chờ xử lý (khôi phục tồn kho sản phẩm)")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(@PathVariable Long id,
                                                            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Vui lòng đăng nhập để thực hiện thao tác"));
        }

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        OrderDto cancelledOrder = orderService.cancelOrder(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Hủy đơn hàng thành công", cancelledOrder));
    }
}
