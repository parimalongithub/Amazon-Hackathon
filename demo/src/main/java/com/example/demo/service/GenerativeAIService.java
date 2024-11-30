package com.example.demo.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo.config.appconfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GenerativeAIService {

    @Autowired
    private appconfig appConfig;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String negotiatePrice(int basePrice, String userMessage) {
        String payload = createPayload(basePrice, userMessage);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        HttpEntity<String> requestEntity = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                appConfig.getApiUrl(),
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        System.out.println("Full API Response Body: " + response.getBody());

        // Extract and return only the negotiation message
        return extractMessageFromResponse(response.getBody());
    }

    private String createPayload(double basePrice, String userMessage) {
        return "{\n" +
                "  \"contents\": [\n" +
                "    {\n" +
                "      \"role\": \"user\",\n" +
                "      \"parts\": [\n" +
                "        {\n" +
                "          \"text\": \"You are a negotiator for a small business. The base price is set for your reference (base price: " + basePrice + "). Your task is to negotiate the price with the customer, keeping it above the base price. The customer’s message is: '" + userMessage + "'.\n" +
                "If the customer agrees to a price above the base price, confirm the offer and let them know you will notify the vendor. Reply: 'Thank you for your offer! Your price of [customer price] per unit is acceptable. I will notify the vendor and get back to you shortly.'\n" +
                "If the customer asks for a price below or exactly at the base, tell them it’s not possible, and suggest continuing the discussion with the vendor directly via chat. Reply: 'I appreciate your offer. Unfortunately, we're unable to accommodate that price at this time. To explore your options further, I recommend you contact the vendor directly via their chat function to discuss pricing possibilities.'\n" +
                "Do not reveal the base price to the customer. If the customer is offering a price higher than the base price, acknowledge their offer and confirm that you will notify the vendor.\"\n" +
                "        }\n" +
                "      ]\n" +
                "    }\n" +
                "  ],\n" +
                "  \"generationConfig\": {\n" +
                "    \"temperature\": 1,\n" +
                "    \"topK\": 64,\n" +
                "    \"topP\": 0.95,\n" +
                "    \"maxOutputTokens\": 8192,\n" +
                "    \"responseMimeType\": \"text/plain\"\n" +
                "  }\n" +
                "}";
    }
    private String extractMessageFromResponse(String responseBody) {
        try {
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");

            if (textNode.isMissingNode()) {
                System.err.println("Error: 'text' node not found in response.");
                return "Error: Unable to extract negotiation message.";
            }

            String negotiationMessage = textNode.asText();
            System.out.println("Negotiation Message: " + negotiationMessage);
            return negotiationMessage;

        } catch (IOException e) {
            e.printStackTrace();
            return "Error: Unable to process response.";
        }
    }
}
