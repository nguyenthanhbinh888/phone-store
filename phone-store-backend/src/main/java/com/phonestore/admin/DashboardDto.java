package com.phonestore.admin;

import com.phonestore.order.OrderDto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long pendingOrders;
    private long confirmedOrders;
    private long shippingOrders;
    private long completedOrders;
    private long cancelledOrders;
    private long totalProducts;
    private int lowStockCount;
    private List<OrderDto> recentOrders;
    private List<LowStockVariantDto> lowStockVariants;

    public DashboardDto() {
    }

    public DashboardDto(BigDecimal totalRevenue, long totalOrders, long pendingOrders, long confirmedOrders,
                        long shippingOrders, long completedOrders, long cancelledOrders, long totalProducts,
                        int lowStockCount, List<OrderDto> recentOrders, List<LowStockVariantDto> lowStockVariants) {
        this.totalRevenue = totalRevenue;
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.confirmedOrders = confirmedOrders;
        this.shippingOrders = shippingOrders;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalProducts = totalProducts;
        this.lowStockCount = lowStockCount;
        this.recentOrders = recentOrders;
        this.lowStockVariants = lowStockVariants;
    }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getPendingOrders() { return pendingOrders; }
    public void setPendingOrders(long pendingOrders) { this.pendingOrders = pendingOrders; }

    public long getConfirmedOrders() { return confirmedOrders; }
    public void setConfirmedOrders(long confirmedOrders) { this.confirmedOrders = confirmedOrders; }

    public long getShippingOrders() { return shippingOrders; }
    public void setShippingOrders(long shippingOrders) { this.shippingOrders = shippingOrders; }

    public long getCompletedOrders() { return completedOrders; }
    public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }

    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public int getLowStockCount() { return lowStockCount; }
    public void setLowStockCount(int lowStockCount) { this.lowStockCount = lowStockCount; }

    public List<OrderDto> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<OrderDto> recentOrders) { this.recentOrders = recentOrders; }

    public List<LowStockVariantDto> getLowStockVariants() { return lowStockVariants; }
    public void setLowStockVariants(List<LowStockVariantDto> lowStockVariants) { this.lowStockVariants = lowStockVariants; }
}
