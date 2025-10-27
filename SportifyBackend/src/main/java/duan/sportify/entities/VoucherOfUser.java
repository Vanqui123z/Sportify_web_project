package duan.sportify.entities;


import javax.persistence.*;
import lombok.*;
import java.time.LocalDate;


@Entity
@Table(name = "voucher_of_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoucherOfUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👉 Liên kết tới bảng user (nhiều - một)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private Users user;

    // 👉 Liên kết tới bảng voucher
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucherid", referencedColumnName = "id", nullable = false)
    private Voucher voucher;

    @Column(name = "discount_percent", nullable = false)
    private Double discountPercent;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
}
