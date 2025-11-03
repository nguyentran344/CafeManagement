package com.cafe.management.service;

import com.cafe.management.model.CafeTable;
import com.cafe.management.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TableService {

    @Autowired
    private TableRepository tableRepository;

    // Lấy tất cả các bàn
    public List<CafeTable> getAllTables() {
        return tableRepository.findAll();
    }

    // Tìm bàn theo ID
    public Optional<CafeTable> getTableById(String id) {
        return tableRepository.findById(id);
    }

    // Thêm bàn mới
    public CafeTable addTable(CafeTable table) {
        return tableRepository.save(table);
    }

    // Cập nhật bàn
    public CafeTable updateTable(String id, CafeTable updatedTable) {
        Optional<CafeTable> optionalTable = tableRepository.findById(id);
        if (optionalTable.isPresent()) {
            CafeTable existing = optionalTable.get();
            existing.setName(updatedTable.getName());
            existing.setStatus(updatedTable.getStatus());
            return tableRepository.save(existing);
        }
        return null;
    }

    // Xóa bàn
    public void deleteTable(String id) {
        tableRepository.deleteById(id);
    }
}
