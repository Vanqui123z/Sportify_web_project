package duan.sportify.entities;
import javax.persistence.*;
import lombok.*;

@Entity
@Table(name = "permanent_booking_detail")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermanentBookingDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detail_id")
    private Integer detailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permanent_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private PermanentBooking permanentBooking;

    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek; // 1 = Monday ... 7 = Sunday

    @Column(name = "shift_id", nullable = false)
    private Integer shiftId;
}
