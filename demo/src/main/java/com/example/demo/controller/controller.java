package com.example.demo.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.GenerativeAIService;

@RestController
@CrossOrigin(origins = "http://localhost:3000") 
public class controller {

    @Autowired
    private GenerativeAIService generativeAIService;

    @PostMapping("/negotiate")
    public String negotiatePrice(@RequestParam String userMessage, @RequestParam int basePrice) 
            throws IOException, InterruptedException {
        return generativeAIService.negotiatePrice(basePrice, userMessage);
    }
}
