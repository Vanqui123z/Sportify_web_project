package duan.sportify.service.impl;

import duan.sportify.service.AIService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

/**
 * GeminiServiceImpl - Sử dụng Google Generative AI (Gemini)
 * Gọi Gemini API bằng REST
 */
@Service
public class GeminiServiceImpl implements AIService {

    @Value("${gemini.api.key:AIzaSyCMzeffGly3YyAHiiBhcdppK8F1Hs-1KmA}")
    private String geminiApiKey;

    @Value("${gemini.api.model:gemini-2.0-flash-exp}")
    private String geminiModel;

    @Override
    public String chat(String message) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            return "⚠️ Gemini API key chưa được cấu hình.";
        }

        Map<String, Object> payload = Map.of(
            "contents", List.of(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", message))
            ))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        RestTemplate restTemplate = new RestTemplate();
        try {
            String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                geminiModel, geminiApiKey
            );
            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> res = (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(payload, headers), Map.class);
            return extractGeminiText(res.getBody());
        } catch (Exception ex) {
            ex.printStackTrace();
            return "❌ Lỗi gọi Gemini: " + ex.getMessage();
        }
    }

    @SuppressWarnings("unchecked")
    private String extractGeminiText(Map<String, Object> body) {
        if (body == null) return null;
        var candidates = (List<Map<String, Object>>) body.get("candidates");
        if (candidates == null || candidates.isEmpty()) return null;
        var content = (Map<String, Object>) candidates.get(0).get("content");
        var parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) return null;
        return (String) parts.get(0).get("text");
    }

    @Override
    public Object data() {
        return new Object();
    }
}
