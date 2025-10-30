package duan.sportify.DTO.APIOutside;
import lombok.Data;

@Data
public class FieldUsage {
    private int fieldId;
    private String fieldName;
    private int totalBookingsDay;
    private int totalBookingsMonth;
}

