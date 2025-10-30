# So sánh: Node.js Generative AI vs Java Vertex AI

## 📦 Package/Library

### Node.js
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
```

### Java (Spring Boot)
```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.google.cloud</groupId>
    <artifactId>google-cloud-aiplatform</artifactId>
    <version>3.38.0</version>
</dependency>
```

---

## 🔑 Authentication

### Node.js - API Key (Đơn giản nhưng kém bảo mật)
```javascript
const genAI = new GoogleGenerativeAI('AIzaSyDqGXy7raV7RXn5cjtQUQYhNPBVxlyu06Y');
```
- ✅ Đơn giản, nhanh
- ❌ Kém bảo mật (API key có thể bị lộ)
- ❌ Khó quản lý trong production

### Java - Service Account (Bảo mật cao)
```java
// Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"

// Code tự động load credentials
PredictionServiceClient client = PredictionServiceClient.create();
```
- ✅ Bảo mật cao (IAM roles)
- ✅ Dễ quản lý trong production
- ❌ Setup phức tạp hơn

---

## 🎯 Khởi tạo Model

### Node.js
```javascript
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
```

### Java
```java
String projectId = "your-project-id";
String location = "us-central1";
String modelName = "gemini-2.5-pro";

String endpointPath = String.format(
    "projects/%s/locations/%s/publishers/google/models/%s",
    projectId, location, modelName
);
EndpointName endpoint = EndpointName.parse(endpointPath);
```

---

## 💬 Gửi Request

### Node.js - Code gốc của bạn
```javascript
async function askQuestion(question) {
    const products = await modelProduct.find({});
    
    const productHTML = products
        .map(product => `
            <div>
                <h3>${product.name}</h3>
                <p>Giá: ${product.price} VND</p>
            </div>
        `)
        .join('');
    
    const prompt = `
        Bạn là một trợ lý bán hàng chuyên nghiệp.
        Đây là danh sách sản phẩm:
        ${productHTML}
        
        Câu hỏi của khách hàng: "${question}"
        Hãy trả lời một cách tự nhiên và thân thiện.
    `;
    
    const result = await model.generateContent(prompt);
    const answer = result.response.text();
    
    return answer.replace(/```(html|plaintext)?\n?/g, '').trim();
}
```

### Java - Tương đương
```java
@Override
public String chat(String message) {
    // 1. Lấy danh sách sản phẩm (tương tự modelProduct.find({}))
    List<Field> fields = fieldService.findAll();
    
    // 2. Tạo HTML từ products
    StringBuilder productHTML = new StringBuilder();
    for (Field field : fields) {
        productHTML.append(String.format("""
            <div>
                <h3>%s</h3>
                <p>Giá: %s VND</p>
            </div>
            """, field.getName(), field.getPrice()));
    }
    
    // 3. Tạo prompt (giống y hệt Node.js)
    String prompt = String.format("""
        Bạn là một trợ lý bán hàng chuyên nghiệp.
        Đây là danh sách sản phẩm:
        %s
        
        Câu hỏi của khách hàng: "%s"
        Hãy trả lời một cách tự nhiên và thân thiện.
        """, productHTML.toString(), message);
    
    try (PredictionServiceClient client = PredictionServiceClient.create()) {
        // 4. Tạo request
        Map<String, Object> instanceMap = new HashMap<>();
        
        List<Map<String, Object>> contentsList = new ArrayList<>();
        Map<String, Object> contentMap = new HashMap<>();
        contentMap.put("role", "user");
        
        List<Map<String, String>> partsList = new ArrayList<>();
        partsList.add(Map.of("text", prompt));
        contentMap.put("parts", partsList);
        contentsList.add(contentMap);
        
        instanceMap.put("contents", contentsList);
        
        // 5. Gọi API (tương đương await model.generateContent)
        Value instance = convertToValue(instanceMap);
        PredictRequest request = PredictRequest.newBuilder()
            .setEndpoint(endpoint.toString())
            .addInstances(instance)
            .build();
        
        PredictResponse response = client.predict(request);
        
        // 6. Extract text (tương đương result.response.text())
        String answer = extractText(response);
        
        // 7. Clean markdown (giống .replace(/```(html|plaintext)?\n?/g, ''))
        return answer.replaceAll("```(html|plaintext)?\\n?", "").trim();
    }
}
```

---

## 📤 Xử lý Response

### Node.js
```javascript
const result = await model.generateContent(prompt);
const answer = result.response.text();
return answer.replace(/```(html|plaintext)?\n?/g, '').trim();
```

### Java
```java
PredictResponse response = client.predict(request);
String responseJson = JsonFormat.printer().print(response.getPredictions(0));
String answer = extractTextFromVertexAIResponse(responseJson);
return answer.replaceAll("```(html|plaintext)?\\n?", "").trim();
```

---

## ⚡ Async/Await

### Node.js - Native async/await
```javascript
async function askQuestion(question) {
    const result = await model.generateContent(prompt);
    return result.response.text();
}

// Usage
const answer = await askQuestion("Tìm sân bóng");
```

### Java - CompletableFuture (nếu muốn async)
```java
public CompletableFuture<String> chatAsync(String message) {
    return CompletableFuture.supplyAsync(() -> {
        return chat(message);
    });
}

// Usage
CompletableFuture<String> future = service.chatAsync("Tìm sân bóng");
String answer = future.get(); // hoặc .thenApply(...)
```

---

## 🔧 Configuration

### Node.js - Hardcoded
```javascript
const genAI = new GoogleGenerativeAI('AIzaSyDqGXy7raV7RXn5cjtQUQYhNPBVxlyu06Y');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
```

### Java - application.properties
```properties
vertex.ai.project.id=your-project-id
vertex.ai.location=us-central1
vertex.ai.model=gemini-2.5-pro
```

```java
@Value("${vertex.ai.project.id}")
private String projectId;

@Value("${vertex.ai.location}")
private String location;

@Value("${vertex.ai.model}")
private String modelName;
```

---

## 🎨 Ví dụ Full Code

### Node.js (Code gốc của bạn)
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyDqGXy7raV7RXn5cjtQUQYhNPBVxlyu06Y');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

async function askQuestion(question) {
    try {
        const products = await modelProduct.find({});
        
        const productHTML = products
            .map(product => `<div><h3>${product.name}</h3></div>`)
            .join('');
        
        const prompt = `Sản phẩm: ${productHTML}\nCâu hỏi: ${question}`;
        
        const result = await model.generateContent(prompt);
        const answer = result.response.text();
        
        return answer.replace(/```(html|plaintext)?\n?/g, '').trim();
    } catch (error) {
        console.error('Lỗi:', error);
        return "Xin lỗi, tôi không thể xử lý yêu cầu.";
    }
}

module.exports = { askQuestion };
```

### Java (Vertex AI - Spring Boot)
```java
@Service
public class VertexAIServiceImpl implements AIService {
    
    @Value("${vertex.ai.project.id}")
    private String projectId;
    
    @Value("${vertex.ai.location}")
    private String location;
    
    @Value("${vertex.ai.model}")
    private String modelName;
    
    @Autowired
    private FieldService fieldService;
    
    @Override
    public String chat(String message) {
        try {
            // 1. Get products/fields
            List<Field> fields = fieldService.findAll();
            
            // 2. Create HTML
            StringBuilder productHTML = new StringBuilder();
            for (Field field : fields) {
                productHTML.append(String.format(
                    "<div><h3>%s</h3></div>", 
                    field.getName()
                ));
            }
            
            // 3. Create prompt
            String prompt = String.format(
                "Sản phẩm: %s\nCâu hỏi: %s",
                productHTML.toString(),
                message
            );
            
            // 4. Call Vertex AI
            try (PredictionServiceClient client = PredictionServiceClient.create()) {
                String endpointPath = String.format(
                    "projects/%s/locations/%s/publishers/google/models/%s",
                    projectId, location, modelName
                );
                
                EndpointName endpoint = EndpointName.parse(endpointPath);
                
                // Create request payload
                Map<String, Object> instanceMap = createRequestPayload(prompt);
                Value instance = convertToProtobufValue(instanceMap);
                
                PredictRequest request = PredictRequest.newBuilder()
                    .setEndpoint(endpoint.toString())
                    .addInstances(instance)
                    .build();
                
                // Get response
                PredictResponse response = client.predict(request);
                String answer = extractTextFromResponse(response);
                
                // Clean markdown
                return answer.replaceAll("```(html|plaintext)?\\n?", "").trim();
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            return "Xin lỗi, tôi không thể xử lý yêu cầu.";
        }
    }
}
```

---

## 📊 Comparison Table

| Feature | Node.js (genai) | Java (Vertex AI) |
|---------|-----------------|------------------|
| **Package** | `@google/generative-ai` | `google-cloud-aiplatform` |
| **Auth** | API Key | Service Account JSON |
| **Setup** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Medium |
| **Security** | ⭐⭐ Low | ⭐⭐⭐⭐⭐ High |
| **Production** | ❌ Not recommended | ✅ Recommended |
| **Async** | Native (async/await) | CompletableFuture |
| **Error Handling** | try/catch | try/catch |
| **Code Lines** | ~30 lines | ~80 lines |
| **Performance** | Similar | Similar |
| **Cost** | Same API pricing | Same API pricing |

---

## 🚀 Migration Checklist

Để chuyển từ Node.js sang Java Vertex AI:

- [ ] ✅ Thêm dependencies vào `pom.xml`
- [ ] ✅ Tạo Google Cloud Project
- [ ] ✅ Enable Vertex AI API
- [ ] ✅ Tạo Service Account và download JSON key
- [ ] ✅ Set `GOOGLE_APPLICATION_CREDENTIALS` environment variable
- [ ] ✅ Cấu hình `application.properties`
- [ ] ✅ Tạo `VertexAIServiceImpl.java`
- [ ] ✅ Update `AIServiceFactory.java`
- [ ] ✅ Test API endpoint
- [ ] ✅ Verify response format

---

## 💡 Tips

### Node.js → Java: Những điều cần lưu ý

1. **String concatenation**
   - Node.js: Template literals `` `${var}` ``
   - Java: `String.format()` hoặc text blocks `"""`

2. **Async handling**
   - Node.js: `async/await`
   - Java: Blocking by default, use `CompletableFuture` for async

3. **JSON parsing**
   - Node.js: Native JSON
   - Java: Gson/Jackson library

4. **Error handling**
   - Node.js: `try/catch` with promises
   - Java: `try/catch` or `@ExceptionHandler`

5. **Configuration**
   - Node.js: Environment variables
   - Java: `application.properties` + `@Value`

---

## 📚 References

- **Node.js SDK**: https://github.com/google/generative-ai-js
- **Java SDK**: https://cloud.google.com/java/docs/reference/google-cloud-aiplatform/latest/overview
- **Vertex AI Docs**: https://cloud.google.com/vertex-ai/docs
