package duan.sportify.DTO.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FieldManagerDTO {
    private Long fieldId;
    private String date;   // "yyyy-MM-dd" hoặc "yyyy-MM"
    private Long total;
}
