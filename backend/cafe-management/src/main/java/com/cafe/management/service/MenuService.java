package com.cafe.management.service;

import com.cafe.management.model.MenuItem;
import com.cafe.management.repository.MenuRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {
    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    // Lấy tất cả món trong menu
    public List<MenuItem> getAll() {
        return menuRepository.findAll();
    }

    // Thêm món mới
    public MenuItem save(MenuItem item) {
        return menuRepository.save(item);
    }

    // Cập nhật món có sẵn
    public MenuItem update(String id, MenuItem updatedItem) {
        MenuItem existing = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món có ID: " + id));

        existing.setName(updatedItem.getName());
        existing.setCategory(updatedItem.getCategory());
        existing.setPrice(updatedItem.getPrice());
        existing.setAvailable(updatedItem.isAvailable());
        existing.setImageUrl(updatedItem.getImageUrl());

        return menuRepository.save(existing);
    }

    // Xóa món
    public void delete(String id) {
        menuRepository.deleteById(id);
    }
}
