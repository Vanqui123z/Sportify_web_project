package duan.sportify.exception;

/**
 * Custom exception class for handling errors related to the nearest field search feature.
 */
public class NearestFieldException extends RuntimeException {
    
    /**
     * Constructs a new NearestFieldException with the specified detail message.
     * 
     * @param message the detail message
     */
    public NearestFieldException(String message) {
        super(message);
    }
    
    /**
     * Constructs a new NearestFieldException with the specified detail message and cause.
     * 
     * @param message the detail message
     * @param cause the cause of the exception
     */
    public NearestFieldException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Creates a NearestFieldException for when coordinates are missing in the database.
     * 
     * @return a new NearestFieldException with a message about missing coordinates
     */
    public static NearestFieldException missingCoordinates() {
        return new NearestFieldException(
            "Không thể tìm sân gần nhất vì một số sân không có thông tin tọa độ. Vui lòng thử lại sau."
        );
    }
    
    /**
     * Creates a NearestFieldException for when user's location is invalid.
     * 
     * @return a new NearestFieldException with a message about invalid location
     */
    public static NearestFieldException invalidUserLocation() {
        return new NearestFieldException(
            "Không thể xác định vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí hoặc thử lại sau."
        );
    }
}