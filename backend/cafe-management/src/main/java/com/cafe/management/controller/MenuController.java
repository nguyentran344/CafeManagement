package com.cafe.management.controller;

import com.cafe.management.model.MenuItem;
import com.cafe.management.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MenuController {

    private final MenuService menuService;

    // ✅ Lấy tất cả món trong menu
    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuService.getAll();
    }

    // ✅ Thêm món có upload ảnh
    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<MenuItem> addMenuItem(
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam(value = "rating", required = false, defaultValue = "5") int rating,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        MenuItem item = new MenuItem();
        item.setName(name);
        item.setPrice(price);
        item.setRating(rating);

        // ✅ Lưu ảnh nếu có - TRỎ RA NGOÀI backend
        if (image != null && !image.isEmpty()) {
            String uploadDir = System.getProperty("user.dir") + "/../uploads"; // LÊN MỘT CẤP
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            item.setImageUrl("/uploads/" + fileName); // URL đúng, server serve /uploads
        }

        return ResponseEntity.ok(menuService.save(item));
    }

    // ✅ Sửa món (có thể đổi ảnh hoặc không)
    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable String id,
            @RequestParam("name") String name,
            @RequestParam("price") double price,
            @RequestParam(value = "rating", required = false, defaultValue = "5") int rating,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        MenuItem existingItem = menuService.getAll().stream()
                .filter(m -> m.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món"));

        existingItem.setName(name);
        existingItem.setPrice(price);
        existingItem.setRating(rating);

        if (image != null && !image.isEmpty()) {
            String uploadDir = System.getProperty("user.dir") + "/../uploads"; // LÊN MỘT CẤP
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            existingItem.setImageUrl("/uploads/" + fileName); // URL đúng
        }

        return ResponseEntity.ok(menuService.save(existingItem));
    }

    // ✅ Xóa món
    @DeleteMapping("/{id}")
    public String deleteMenuItem(@PathVariable String id) {
        menuService.delete(id);
        return "Đã xóa món có ID: " + id;
    }
}