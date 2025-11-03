package com.cafe.management.controller;

import com.cafe.management.model.Order;
import com.cafe.management.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ✅ User đặt bàn + món
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    // ✅ Admin xem tất cả order
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // ✅ Admin cập nhật trạng thái đơn
    @PutMapping("/{id}/status")
    public Order updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return orderService.updateOrderStatus(id, body.get("status"));
    }
}
