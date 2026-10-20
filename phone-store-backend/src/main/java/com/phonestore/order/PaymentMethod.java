package com.phonestore.order;

public enum PaymentMethod {
    COD("Thanh toán tiền mặt khi nhận hàng (COD)"),
    BANK_TRANSFER("Chuyển khoản ngân hàng"),
    VNPAY("Thanh toán qua ví / VNPAY-QR");

    private final String description;

    PaymentMethod(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
