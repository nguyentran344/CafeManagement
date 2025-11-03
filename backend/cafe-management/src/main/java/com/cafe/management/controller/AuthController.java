package com.cafe.management.controller;

import com.cafe.management.model.User;
import com.cafe.management.service.UserService;
import com.cafe.management.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> req) {
        User user = userService.register(req.get("username"), req.get("password"));
        return Map.of("message", "Đăng ký thành công", "role", user.getRole());
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> req) {
        User user = userService.login(req.get("username"), req.get("password"));
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return Map.of("token", token, "role", user.getRole());
    }
}
