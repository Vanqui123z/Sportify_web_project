package duan.sportify.entities;

import javax.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "permanent_booking")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PermanentBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permanent_id")
    private Integer permanentId;

    @Column(name = "field_id", nullable = false)
    private Integer fieldId;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "active", nullable = false)
    private Integer active = 1;

    @OneToMany(mappedBy = "permanentBooking",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    @Builder.Default
    private List<PermanentBookingDetail> details = new ArrayList<>();
}
