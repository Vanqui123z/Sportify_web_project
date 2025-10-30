package duan.sportify.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

import javax.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.Map;

/**
 * Exception handler for nearest field operations.
 */
@ControllerAdvice
public class NearestFieldExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(NearestFieldExceptionHandler.class);
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleEntityNotFound(EntityNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage() != null ? ex.getMessage() : "Entity not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
    
    @ExceptionHandler(NearestFieldException.class)
    public ResponseEntity<Map<String, String>> handleNearestFieldException(NearestFieldException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage() != null ? ex.getMessage() : "Nearest field error");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "An unexpected error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<Map<String, String>> handleEntityNotFoundException(EntityNotFoundException ex) {
        logger.error("Entity not found exception: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("error", ex.getMessage()));
    }
    
    /**
     * Handles NullPointerException for unexpected null values.
     * @param ex The exception to handle
     * @return A 500 INTERNAL SERVER ERROR response with an error message
     */
    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Map<String, String>> handleNullPointerException(NullPointerException ex) {
        logger.error("Null pointer exception: {}", ex.getMessage(), ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."));
    }
    
    /**
     * Handles parameter type mismatch errors, such as invalid format for numbers, dates, etc.
     * @param ex The exception to handle
     * @return A 400 BAD REQUEST response with an error message
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String paramName = ex.getName();
        String requiredType = ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown";
        
        logger.error("Parameter type mismatch: {} should be of type {}", paramName, requiredType);
        
        String message = String.format(
            "Tham số '%s' không hợp lệ. Vui lòng cung cấp một giá trị %s hợp lệ.",
            paramName, 
            getVietnameseTypeName(requiredType)
        );
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("error", message));
    }
    
    /**
     * Handles missing required request parameters.
     * @param ex The exception to handle
     * @return A 400 BAD REQUEST response with an error message
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handleMissingServletRequestParameter(MissingServletRequestParameterException ex) {
        logger.error("Missing required parameter: {}", ex.getParameterName());
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("error", 
                    String.format("Thiếu tham số bắt buộc: %s", ex.getParameterName())));
    }
    
    /**
     * Handles errors related to the nearest field search feature.
     * @param ex The exception to handle
     * @return A 400 BAD REQUEST response with an error message
     */
    @ExceptionHandler(NearestFieldException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handleNearestFieldException(NearestFieldException ex) {
        logger.error("Nearest field search error: {}", ex.getMessage());
        
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Collections.singletonMap("error", ex.getMessage()));
    }
    
    /**
     * Catch-all handler for any uncaught exceptions.
     * @param ex The exception to handle
     * @return A 500 INTERNAL SERVER ERROR response with an error message
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        logger.error("Unhandled exception", ex);
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."));
    }
    
    /**
     * Helper method to convert Java type names to Vietnamese friendly descriptions.
     * @param typeName The Java type name
     * @return A Vietnamese description of the type
     */
    private String getVietnameseTypeName(String typeName) {
        return switch(typeName.toLowerCase()) {
            case "integer", "int" -> "số nguyên";
            case "double", "float" -> "số thập phân";
            case "string" -> "chuỗi";
            case "boolean" -> "giá trị boolean";
            case "localdate" -> "ngày";
            case "localtime" -> "thời gian";
            case "localdatetime" -> "ngày giờ";
            default -> typeName;
        };
    }
}