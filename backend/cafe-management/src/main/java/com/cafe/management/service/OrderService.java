package com.cafe.management.service;

import com.cafe.management.model.CafeTable;
import com.cafe.management.model.Order;
import com.cafe.management.repository.OrderRepository;
import com.cafe.management.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final TableRepository tableRepository;

    // ✅ Tạo đơn mới (user đặt bàn)
    public Order createOrder(Order order) {
        double total = order.getItems().stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotal(total);

        if ("MANG_VỀ".equalsIgnoreCase(order.getOrderType())) {
            order.setStatus("ĐÃ_THANH_TOÁN");
        } else {
            order.setStatus("ĐANG_PHỤC_VỤ");
        }

        Order saved = orderRepository.save(order);

        // Nếu uống tại quán → cập nhật bàn
        if ("UỐNG_TẠI_QUÁN".equalsIgnoreCase(order.getOrderType()) && order.getTableId() != null) {
            CafeTable table = tableRepository.findById(order.getTableId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn"));
            table.setStatus("ĐANG_PHỤC_VỤ");
            table.setCurrentOrderId(saved.getId());
            tableRepository.save(table);
        }

        return saved;
    }

    // ✅ Xem tất cả order (Admin)
    public java.util.List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ✅ Cập nhật trạng thái order
    public Order updateOrderStatus(String id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy order"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
