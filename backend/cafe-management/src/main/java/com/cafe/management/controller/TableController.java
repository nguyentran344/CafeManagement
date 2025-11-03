package com.cafe.management.controller;

import com.cafe.management.model.CafeTable;
import com.cafe.management.model.Order;
import com.cafe.management.repository.OrderRepository;
import com.cafe.management.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TableController {

    private final TableRepository tableRepository;
    private final OrderRepository orderRepository;

    // ✅ Lấy danh sách bàn
    @GetMapping
    public List<CafeTable> getAllTables() {
        return tableRepository.findAll();
    }

    // ✅ Thêm bàn (Admin)
    @PostMapping
    public CafeTable addTable(@RequestBody CafeTable table) {
        if (table.getStatus() == null || table.getStatus().isEmpty()) {
            table.setStatus("CHƯA_CÓ_KHÁCH");
        }
        table.setOccupied(false);
        table.setTotalAmount(0.0);
        table.setCurrentOrderId(null);
        return tableRepository.save(table);
    }

    // ✅ Cập nhật trạng thái bàn (Admin)
    @PutMapping("/{id}/status")
    public ResponseEntity<CafeTable> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");

        CafeTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn"));

        table.setStatus(newStatus);

        switch (newStatus) {
            case "CHƯA_CÓ_KHÁCH" -> {
                table.setOccupied(false);
                table.setTotalAmount(0.0);
                table.setCurrentOrderId(null);
            }
            case "ĐANG_PHỤC_VỤ" -> {
                table.setOccupied(true);
            }
            case "ĐÃ_THANH_TOÁN" -> {
                table.setOccupied(false);

                // ✅ Cập nhật trạng thái Order tương ứng
                if (table.getCurrentOrderId() != null) {
                    Order order = orderRepository.findById(table.getCurrentOrderId())
                            .orElse(null);
                    if (order != null) {
                        order.setStatus("ĐÃ_THANH_TOÁN");
                        orderRepository.save(order);
                    }
                }

                // ✅ Reset bàn sau khi thanh toán
                table.setTotalAmount(0.0);
                table.setCurrentOrderId(null);
            }
        }

        CafeTable updated = tableRepository.save(table);
        return ResponseEntity.ok(updated);
    }

    // ✅ Xóa bàn (Admin)
    @DeleteMapping("/{id}")
    public String deleteTable(@PathVariable String id) {
        tableRepository.deleteById(id);
        return "Đã xóa bàn có ID: " + id;
    }
}
