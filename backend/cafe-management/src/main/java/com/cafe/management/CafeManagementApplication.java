package com.cafe.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class CafeManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(CafeManagementApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer webMvcConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {

				String uploadPath = System.getProperty("user.dir") + "/../uploads/";
				registry.addResourceHandler("/uploads/**")
						.addResourceLocations("file:" + uploadPath);
			}
		};
	}

}
