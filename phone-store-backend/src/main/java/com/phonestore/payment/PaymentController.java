package com.phonestore.payment;

import com.phonestore.common.exception.ResourceNotFoundException;
import com.phonestore.common.response.ApiResponse;
import com.phonestore.order.Order;
import com.phonestore.order.OrderDto;
import com.phonestore.order.OrderRepository;
import com.phonestore.order.PaymentStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/payment")
@Tag(name = "Payment API", description = "Các API thanh toán trực tuyến, khởi tạo mã VietQR động và xác nhận giao dịch")
public class PaymentController {

    private final OrderRepository orderRepository;

    public PaymentController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/vietqr/{orderCode}")
    @Operation(summary = "Lấy mã VietQR động theo chuẩn Napas247 cho đơn hàng")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<VietQrResponse>> getVietQr(@PathVariable String orderCode) {
        Order order = orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "mã đơn hàng", orderCode));

        long amount = order.getFinalAmount().longValue();
        String bankId = "970436"; // Vietcombank bin code
        String bankName = "Vietcombank (Ngân hàng TMCP Ngoại thương Việt Nam)";
        String accountNumber = "0988776655";
        String accountName = "CONG TY TNHH PHONE STORE VIET NAM";
        String encodedContent = URLEncoder.encode(order.getOrderCode(), StandardCharsets.UTF_8);
        String encodedName = URLEncoder.encode(accountName, StandardCharsets.UTF_8);

        String qrUrl = String.format(
                "https://img.vietqr.io/image/%s-%s-compact2.png?amount=%d&addInfo=%s&accountName=%s",
                bankId,
                accountNumber,
                amount,
                encodedContent,
                encodedName
        );

        VietQrResponse response = new VietQrResponse(
                order.getOrderCode(),
                order.getFinalAmount(),
                qrUrl,
                bankName,
                bankId,
                accountNumber,
                accountName,
                order.getOrderCode(),
                order.getPaymentStatus().name()
        );

        return ResponseEntity.ok(ApiResponse.ok("Khởi tạo mã VietQR thành công", response));
    }

    @PostMapping("/simulate-pay/{orderCode}")
    @Operation(summary = "Giả lập thanh toán trực tuyến thành công (dành cho kiểm thử giao dịch chuyển khoản / VNPAY)")
    @Transactional
    public ResponseEntity<ApiResponse<OrderDto>> simulatePayment(@PathVariable String orderCode) {
        Order order = orderRepository.findByOrderCodeWithItems(orderCode)
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "mã đơn hàng", orderCode));

        order.setPaymentStatus(PaymentStatus.PAID);
        Order savedOrder = orderRepository.save(order);

        return ResponseEntity.ok(ApiResponse.ok("Thanh toán đơn hàng " + orderCode + " thành công!", OrderDto.fromEntity(savedOrder)));
    }
}
