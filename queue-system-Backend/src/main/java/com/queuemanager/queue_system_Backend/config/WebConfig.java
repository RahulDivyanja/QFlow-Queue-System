package com.queuemanager.queue_system_Backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Apply to ALL endpoints
                        .allowedOrigins("http://localhost:3000/") // Allow Next.js
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow these actions
                        .allowedHeaders("*") // Allow all headers
                        .allowCredentials(true); // Allow cookies/auth tokens
            }
        };
    }

}
