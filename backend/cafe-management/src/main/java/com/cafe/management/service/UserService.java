package com.cafe.management.service;

import com.cafe.management.model.User;
import com.cafe.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Tạo user admin mặc định khi khởi động
    @PostConstruct
    public void initAdmin() {
        if (userRepository.findByUsername("root").isEmpty()) {
            User admin = User.builder()
                    .username("root")
                    .password(passwordEncoder.encode("root123"))
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(admin);
        }
    }

    public User register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .role("ROLE_USER")
                .build();
        return userRepository.save(user);
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Sai tài khoản hoặc mật khẩu"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai tài khoản hoặc mật khẩu");
        }
        return user;
    }
}
