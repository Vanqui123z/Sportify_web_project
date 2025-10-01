package duan.sportify.DTO.booking;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingEventDTO {
    private Integer bookingId;
    private String title;          // "Sân A - Ca 1"
    private LocalDateTime start;   // ISO datetime
    private LocalDateTime end;     // ISO datetime
    private Integer dayOfWeek ;     // 1=Mon ... 7=Sun, chỉ dùng cho PERMANENT
    private String type;           // ONCE hoặc PERMANENT
}

