package com.phonestore.product;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filter(
            String keyword,
            Long brandId,
            String brandSlug,
            Long categoryId,
            String categorySlug,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String ram,
            String storage
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Luôn chỉ lấy sản phẩm active
            predicates.add(cb.isTrue(root.get("isActive")));

            // Đảm bảo không bị duplicate khi join sang variants
            if (query != null) {
                query.distinct(true);
            }

            // Tìm kiếm theo từ khóa (tên hoặc mô tả)
            if (keyword != null && !keyword.trim().isEmpty()) {
                String searchPattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("name")), searchPattern);
                Predicate descLike = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(nameLike, descLike));
            }

            // Lọc theo Brand
            if (brandId != null) {
                predicates.add(cb.equal(root.get("brand").get("id"), brandId));
            } else if (brandSlug != null && !brandSlug.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("brand").get("slug")), brandSlug.trim().toLowerCase()));
            }

            // Lọc theo Category
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            } else if (categorySlug != null && !categorySlug.trim().isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("category").get("slug")), categorySlug.trim().toLowerCase()));
            }

            // Lọc theo thông tin của Variant (Giá, RAM, Bộ nhớ)
            boolean needVariantJoin = (minPrice != null) || (maxPrice != null) ||
                    (ram != null && !ram.trim().isEmpty()) ||
                    (storage != null && !storage.trim().isEmpty());

            if (needVariantJoin) {
                Join<Product, ProductVariant> variantJoin = root.join("variants", JoinType.LEFT);

                if (minPrice != null) {
                    predicates.add(cb.greaterThanOrEqualTo(variantJoin.get("price"), minPrice));
                }
                if (maxPrice != null) {
                    predicates.add(cb.lessThanOrEqualTo(variantJoin.get("price"), maxPrice));
                }
                if (ram != null && !ram.trim().isEmpty()) {
                    predicates.add(cb.equal(cb.lower(variantJoin.get("ram")), ram.trim().toLowerCase()));
                }
                if (storage != null && !storage.trim().isEmpty()) {
                    predicates.add(cb.equal(cb.lower(variantJoin.get("storage")), storage.trim().toLowerCase()));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
