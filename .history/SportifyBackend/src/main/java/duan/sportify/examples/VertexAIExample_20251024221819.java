package duan.sportify.examples;

import com.google.cloud.aiplatform.v1.*;
import com.google.protobuf.Value;
import com.google.protobuf.util.JsonFormat;
import java.util.*;

/**
 * Example: Sử dụng Vertex AI giống như code Node.js bạn đã cung cấp
 * 
 * Code Node.js gốc:
 * ```javascript
 * const { GoogleGenerativeAI } = require('@google/generative-ai');
 * const genAI = new GoogleGenerativeAI('AIzaSyDqGXy7raV7RXn5cjtQUQYhNPBVxlyu06Y');
 * const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
 * 
 * const result = await model.generateContent(prompt);
 * const answer = result.response.text();
 * ```
 * 
 * Tương đương trong Java với Vertex AI:
 */
public class VertexAIExample {

    /**
     * So sánh: Node.js Generative AI vs Java Vertex AI
     * 
     * Node.js:
     *   const genAI = new GoogleGenerativeAI(apiKey);
     *   const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
     * 
     * Java:
     *   PredictionServiceClient client = PredictionServiceClient.create();
     *   EndpointName endpoint = EndpointName.parse("projects/.../models/gemini-2.5-pro");
     */
    public static void main(String[] args) throws Exception {
        String projectId = "YOUR_PROJECT_ID";
        String location = "us-central1";
        String modelName = "gemini-2.5-pro";
        
        // 1. Tạo client (tương đương new GoogleGenerativeAI)
        try (PredictionServiceClient client = PredictionServiceClient.create()) {
            
            // 2. Tạo endpoint path
            String endpointPath = String.format(
                "projects/%s/locations/%s/publishers/google/models/%s",
                projectId, location, modelName
            );
            EndpointName endpoint = EndpointName.parse(endpointPath);
            
            // 3. Tạo prompt (giống như code Node.js)
            String prompt = """
                Bạn là một trợ lý bán hàng chuyên nghiệp.
                
                Câu hỏi của khách hàng: "Tôi muốn tìm sân bóng đá gần đây"
                
                Hãy trả lời một cách tự nhiên và thân thiện.
                """;
            
            // 4. Tạo request payload
            Map<String, Object> instanceMap = new HashMap<>();
            
            // Tạo contents (tương đương model.generateContent(prompt))
            List<Map<String, Object>> contentsList = new ArrayList<>();
            Map<String, Object> contentMap = new HashMap<>();
            contentMap.put("role", "user");
            
            List<Map<String, String>> partsList = new ArrayList<>();
            Map<String, String> partMap = new HashMap<>();
            partMap.put("text", prompt);
            partsList.add(partMap);
            
            contentMap.put("parts", partsList);
            contentsList.add(contentMap);
            instanceMap.put("contents", contentsList);
            
            // 5. Thêm generation config
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.7);
            generationConfig.put("maxOutputTokens", 8192);
            instanceMap.put("generation_config", generationConfig);
            
            // 6. Convert to protobuf Value
            String jsonString = new com.google.gson.Gson().toJson(instanceMap);
            Value.Builder instanceBuilder = Value.newBuilder();
            JsonFormat.parser().merge(jsonString, instanceBuilder);
            Value instance = instanceBuilder.build();
            
            // 7. Gọi API (tương đương await model.generateContent)
            PredictRequest request = PredictRequest.newBuilder()
                .setEndpoint(endpoint.toString())
                .addInstances(instance)
                .build();
            
            PredictResponse response = client.predict(request);
            
            // 8. Extract text (tương đương result.response.text())
            if (response.getPredictionsCount() > 0) {
                String responseJson = JsonFormat.printer().print(response.getPredictions(0));
                String answer = extractText(responseJson);
                
                System.out.println("AI Response: " + answer);
            }
        }
    }
    
    /**
     * Extract text từ response
     * Tương đương: result.response.text()
     */
    private static String extractText(String responseJson) {
        com.google.gson.JsonObject jsonObject = 
            com.google.gson.JsonParser.parseString(responseJson).getAsJsonObject();
        
        return jsonObject
            .getAsJsonArray("candidates").get(0).getAsJsonObject()
            .getAsJsonObject("content")
            .getAsJsonArray("parts").get(0).getAsJsonObject()
            .get("text").getAsString();
    }
}

/**
 * ================== COMPARISON TABLE ==================
 * 
 * | Feature              | Node.js (genai)           | Java (Vertex AI)                  |
 * |----------------------|---------------------------|-----------------------------------|
 * | Package              | @google/generative-ai     | google-cloud-aiplatform           |
 * | Authentication       | API Key                   | Service Account JSON              |
 * | Initialization       | new GoogleGenerativeAI()  | PredictionServiceClient.create()  |
 * | Model Selection      | getGenerativeModel()      | EndpointName.parse()              |
 * | Generate Content     | generateContent(prompt)   | client.predict(request)           |
 * | Get Response         | result.response.text()    | Extract from PredictResponse      |
 * | Async/Await          | Yes (async/await)         | Blocking (can use CompletableFuture)|
 * | Error Handling       | try/catch                 | try/catch                         |
 * 
 * ======================================================
 */
