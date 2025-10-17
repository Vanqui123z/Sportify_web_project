package duan.sportify;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import duan.sportify.exception.NearestFieldException;
import duan.sportify.utils.ErrorResponse;
import duan.sportify.utils.FieldErrorInfo;


/**
 * Xử lý ngoại lệ toàn cầu cho toàn bộ ứng dụng.
 * Class này bắt các exception và chuyển đổi chúng thành HTTP responses phù hợp.
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
	@ExceptionHandler(MethodArgumentNotValidException.class)
    public static ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        List<FieldError> errors = ex.getBindingResult().getFieldErrors();
        List<FieldErrorInfo> errorInfos = new ArrayList<>();
        for (FieldError error : errors) {
            String field = error.getField();
            String message = error.getDefaultMessage();
            FieldErrorInfo errorInfo = new FieldErrorInfo();
            errorInfo.setField(field);
            errorInfo.setMessage(message);
            errorInfos.add(errorInfo);
        }
        
        ErrorResponse errorResponse = new ErrorResponse();
        errorResponse.setTimestamp(Instant.now().toString());
        errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
        errorResponse.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorResponse.setErrors(errorInfos);
        
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    /**
     * Xử lý EntityNotFoundException khi không tìm thấy entity
     * @param ex Exception cần xử lý
     * @return Response với HTTP 404 NOT FOUND và thông báo lỗi
     */
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<Map<String, String>> handleEntityNotFoundException(EntityNotFoundException ex) {
        logger.error("Entity not found exception: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("error", ex.getMessage()));
    }
    
    /**
     * Xử lý NullPointerException cho các giá trị null không mong muốn
     * @param ex Exception cần xử lý
     * @return Response với HTTP 500 INTERNAL SERVER ERROR và thông báo lỗi
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
     * Xử lý lỗi không khớp kiểu tham số, ví dụ như định dạng không hợp lệ cho số, ngày tháng, v.v.
     * @param ex Exception cần xử lý
     * @return Response với HTTP 400 BAD REQUEST và thông báo lỗi
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
     * Xử lý thiếu tham số bắt buộc
     * @param ex Exception cần xử lý
     * @return Response với HTTP 400 BAD REQUEST và thông báo lỗi
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
     * Xử lý các lỗi liên quan đến tính năng tìm sân gần nhất
     * @param ex Exception cần xử lý
     * @return Response với HTTP 400 BAD REQUEST và thông báo lỗi
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
     * Xử lý tất cả các exception chưa được bắt
     * @param ex Exception cần xử lý
     * @return Response với HTTP 500 INTERNAL SERVER ERROR và thông báo lỗi
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex, HttpServletRequest request) {
        logger.error("Unhandled exception at {} {}: {}", 
            request.getMethod(), request.getRequestURI(), ex.getMessage(), ex);
        
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."));
    }
    
    /**
     * Helper method để chuyển đổi tên kiểu Java sang mô tả thân thiện bằng tiếng Việt
     * @param typeName Tên kiểu Java
     * @return Mô tả tiếng Việt của kiểu dữ liệu
     */
    private static String getVietnameseTypeName(String typeName) {
        switch(typeName.toLowerCase()) {
            case "integer": 
            case "int": 
                return "số nguyên";
            case "double": 
            case "float": 
                return "số thập phân";
            case "string": 
                return "chuỗi";
            case "boolean": 
                return "giá trị boolean";
            case "localdate": 
                return "ngày";
            case "localtime": 
                return "thời gian";
            case "localdatetime": 
                return "ngày giờ";
            default: 
                return typeName;
        }
    }
}

