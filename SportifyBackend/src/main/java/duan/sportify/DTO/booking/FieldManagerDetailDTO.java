package duan.sportify.DTO.booking;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FieldManagerDetailDTO {
    private Integer fieldId;
    private String fieldName;
    private Long oneTimeBookings;
    private Long permanentBookings;
    private Long totalBookings;
}
