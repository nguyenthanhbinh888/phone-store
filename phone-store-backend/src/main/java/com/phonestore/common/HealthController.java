package com.phonestore.common;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "phone-store-backend");
        status.put("timestamp", System.currentTimeMillis());

        try {
            Integer dbCheck = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            status.put("database", "CONNECTED");
            status.put("databaseCheckResult", dbCheck);
        } catch (Exception e) {
            status.put("database", "ERROR: " + e.getMessage());
            return ResponseEntity.status(500).body(status);
        }

        return ResponseEntity.ok(status);
    }
}
