package com.example.demo.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class appconfig {
    @Value("${api.key}")
    private String apiKey;
    
    public String getApiKey() {
        return apiKey;
    }
    
    public String getApiUrl() {
        return "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
    }
    
}
