package com.cafe.management.controller;

import com.cafe.management.model.Order;
import com.cafe.management.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

        private final OrderRepository orderRepository;

        @GetMapping("/stats")
        public Map<String, Object> getStats() {
                Calendar cal = Calendar.getInstance();
                cal.set(Calendar.HOUR_OF_DAY, 0);
                cal.set(Calendar.MINUTE, 0);
                cal.set(Calendar.SECOND, 0);
                Date startOfDay = cal.getTime();

                // ✅ Chỉ tính đơn đã thanh toán hôm nay
                List<Order> ordersToday = orderRepository.findAll().stream()
                                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().after(startOfDay))
                                .filter(o -> "ĐÃ_THANH_TOÁN".equalsIgnoreCase(o.getStatus()))
                                .toList();

                long totalCustomers = ordersToday.stream()
                                .mapToLong(Order::getGuestCount)
                                .sum();
                double totalRevenue = ordersToday.stream().mapToDouble(Order::getTotal).sum();

                return Map.of(
                                "totalCustomers", totalCustomers,
                                "totalRevenue", totalRevenue);
        }
}
