package com.phonestore.payment;

import java.math.BigDecimal;

public class VietQrResponse {
    private String orderCode;
    private BigDecimal amount;
    private String qrImageUrl;
    private String bankName;
    private String bankId;
    private String accountNumber;
    private String accountName;
    private String transferContent;
    private String paymentStatus;

    public VietQrResponse() {
    }

    public VietQrResponse(String orderCode, BigDecimal amount, String qrImageUrl, String bankName,
                          String bankId, String accountNumber, String accountName,
                          String transferContent, String paymentStatus) {
        this.orderCode = orderCode;
        this.amount = amount;
        this.qrImageUrl = qrImageUrl;
        this.bankName = bankName;
        this.bankId = bankId;
        this.accountNumber = accountNumber;
        this.accountName = accountName;
        this.transferContent = transferContent;
        this.paymentStatus = paymentStatus;
    }

    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getQrImageUrl() { return qrImageUrl; }
    public void setQrImageUrl(String qrImageUrl) { this.qrImageUrl = qrImageUrl; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getBankId() { return bankId; }
    public void setBankId(String bankId) { this.bankId = bankId; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }

    public String getTransferContent() { return transferContent; }
    public void setTransferContent(String transferContent) { this.transferContent = transferContent; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
