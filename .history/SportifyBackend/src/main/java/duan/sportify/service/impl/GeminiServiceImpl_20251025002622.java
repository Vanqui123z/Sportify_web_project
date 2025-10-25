package duan.sportify.service.impl;

import duan.sportify.entities.Products;
import duan.sportify.service.AIService;
import duan.sportify.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * GeminiServiceImpl - Sử dụng Google Generative AI (Gemini)
 * Gọi Gemini API bằng REST với context sản phẩm từ database
 */
@Service
public class GeminiServiceImpl implements AIService {

    @Value("${gemini.api.key:AIzaSyCMzeffGly3YyAHiiBhcdppK8F1Hs-1KmA}")
    private String geminiApiKey;

    @Value("${gemini.api.model:gemini-2.0-flash-exp}")
    private String geminiModel;

    @Autowired
    private ProductService productService;

    @Override
    public String chat(String message) {
        if (geminiApiKey == null || geminiApiKey.isEmpty()) {
            return "⚠️ Gemini API key chưa được cấu hình.";
        }

        try {
            // Lấy danh sách sản phẩm từ database
            List<Products> products = productService.findAll();
            String productHTML = buildProductHTML(products);

            // Xây dựng prompt với context sản phẩm
            String prompt = buildPrompt(message, productHTML);

            System.out.println("🔵 Gọi Gemini API với câu hỏi: " + message);
            System.out.println("📦 Số sản phẩm được gửi: " + products.size());

            Map<String, Object> payload = Map.of(
                "contents", List.of(Map.of(
                    "role", "user",
                    "parts", List.of(Map.of("text", prompt))
                ))
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            RestTemplate restTemplate = new RestTemplate();
            String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                geminiModel, geminiApiKey
            );

            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> res = (ResponseEntity<Map<String, Object>>) (ResponseEntity<?>) 
                restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(payload, headers), Map.class);

            System.out.println("📥 Response Status: " + res.getStatusCode());

            String result = extractGeminiText(res.getBody());
            System.out.println("✅ Response nhận được từ Gemini");
            
            return result != null ? result : "❌ Không nhận được phản hồi từ Gemini";
        } catch (Exception ex) {
            System.out.println("❌ Exception: " + ex.getClass().getName() + " - " + ex.getMessage());
            ex.printStackTrace();
            return "❌ Lỗi gọi Gemini: " + ex.getMessage();
        }
    }

    /**
     * Xây dựng danh sách sản phẩm dưới dạng HTML
     */
    private String buildProductHTML(List<Products> products) {
        return products.stream()
            .map(product -> String.format(
                "<div style=\"border: 1px solid #ddd; padding: 12px; margin: 8px 0; border-radius: 6px; " +
                "box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1); background: #f9f9f9;\">" +
                "%s" +
                "<div>" +
                "<h3 style=\"font-size: 14px; margin: 4px 0; font-weight: bold; color: #333;\">%s</h3>" +
                "<p style=\"margin: 4px 0; color: #555; font-size: 13px;\"><strong>Giá:</strong> %s VND</p>" +
                "<p style=\"margin: 4px 0; color: #666; font-size: 12px;\">%s</p>" +
                "<a href=\"http://localhost:5173/user/product-detail/%s\" style=\"color: #007bff; text-decoration: none; font-size: 13px;\">Xem sản phẩm</a>" +
                "</div>" +
                "</div>",
                product.getImage() != null ? 
                    String.format("<img src=\"%s\" alt=\"%s\" style=\"width: 70px; height: 70px; object-fit: cover; border-radius: 4px; float: left; margin-right: 12px;\">", 
                        product.getImage(), product.getProductname()) : "",
                product.getProductname(),
                product.getPrice(),
                product.getDescriptions() != null ? product.getDescriptions() : "",
                product.getProductid()
            ))
            .collect(Collectors.joining("\n"));
    }

    /**
     * Xây dựng prompt với context sản phẩm
     */
    private String buildPrompt(String question, String productHTML) {
        return String.format(
            "Bạn là một trợ lý bán hàng chuyên nghiệp và thân thiện của cửa hàng Sportify. " +
            "Danh sách sản phẩm hiện có:\n%s\n\n" +
            "Câu hỏi của khách hàng: \"%s\"\n\n" +
            "Hãy trả lời một cách tự nhiên, thân thiện, và hữu ích. " +
            "Nếu câu hỏi liên quan đến sản phẩm, hãy gợi ý sản phẩm phù hợp. " +
            "Nếu câu hỏi không liên quan đến sản phẩm, hãy trả lời một cách tự nhiên. " +
            "Trả lời bằng HTML để dễ đọc hơn.",
            productHTML, question
        );
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
