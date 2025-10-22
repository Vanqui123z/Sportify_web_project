package duan.sportify.dao;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import duan.sportify.entities.Bookingdetails;
import duan.sportify.entities.Field;
import duan.sportify.entities.PermanentBooking;

@SuppressWarnings("unused")
public interface BookingDetailDAO extends JpaRepository<Bookingdetails, Integer> {
	@Query(value = "SELECT  s.* FROM bookingdetails bd\r\n"
			+ "JOIN field s ON bd.fieldid = s.fieldid\r\n"
			+ "GROUP BY bd.fieldid\r\n"
			+ "ORDER BY COUNT(*) DESC\r\n", nativeQuery = true)
	List<Object[]> findTopFieldsWithMostBookings();

	@Query(value = "SELECT * FROM bookingdetails WHERE bookingid = :bookingid", nativeQuery = true)

	List<Bookingdetails> detailBooking(@Param("bookingid") Integer bookingid);

	@Query("SELECT p FROM PermanentBooking p " +
			"LEFT JOIN FETCH p.field " +
			"LEFT JOIN FETCH p.shift " +
			"WHERE p.bookingId = :bookingid")
	List<PermanentBooking> detailPermanentBooking(@Param("bookingid") Integer bookingid);

	// dashboard

	// top 3 san được dat nhiều nhất
	@Query(value = "SELECT\r\n"
			+ "    f.namefield AS field_name,\r\n"
			+ "    f.price AS field_price,\r\n"
			+ "    COUNT(b.fieldid) AS booking_count,\r\n"
			+ "    SUM(CASE\r\n"
			+ "        WHEN bk.bookingstatus = 'Hoàn Thành' THEN b.price\r\n"
			+ "        ELSE b.price * 0.3\r\n"
			+ "    END) AS total_revenue\r\n"
			+ "FROM\r\n"
			+ "    field f\r\n"
			+ "JOIN\r\n"
			+ "    bookingdetails b ON f.fieldid = b.fieldid\r\n"
			+ "JOIN\r\n"
			+ "    bookings bk ON b.bookingid = bk.bookingid\r\n"
			+ "WHERE\r\n"
			+ "    bk.bookingstatus <> 'Hủy Đặt'\r\n"
			+ "GROUP BY\r\n"
			+ "    f.fieldid, f.namefield, f.price\r\n"
			+ "ORDER BY\r\n"
			+ "    booking_count DESC\r\n"
			+ "LIMIT 3;", nativeQuery = true)
	List<Object[]> top3SanDatNhieu();

	// top 5 dăt san
	@Query(value = "SELECT\r\n"
			+ "    u.firstname,\r\n"
			+ "    u.lastname,\r\n"
			+ "    u.phone,\r\n"
			+ "    COUNT(b.bookingid) AS booking_count,\r\n"
			+ "    SUM(CASE\r\n"
			+ "        WHEN b.bookingstatus IN ('Hoàn Thành', 'Đã Cọc') THEN b.bookingprice * 0.3\r\n"
			+ "        ELSE 0\r\n"
			+ "    END) AS total_revenue\r\n"
			+ "FROM\r\n"
			+ "    users u\r\n"
			+ "JOIN\r\n"
			+ "    bookings b ON u.username = b.username\r\n"
			+ "GROUP BY\r\n"
			+ "    u.username, u.firstname, u.lastname, u.phone\r\n"
			+ "ORDER BY\r\n"
			+ "    booking_count DESC\r\n"
			+ "LIMIT 5;", nativeQuery = true)
	List<Object[]> top5UserDatSan();

   // BookingDetail theo ngay
    @Query("SELECT b.fieldid AS fieldId, b.playdate AS date, COUNT(b) AS total " +
           "FROM Bookingdetails b " +
           "GROUP BY b.fieldid, b.playdate")
    List<Map<String, Object>> countUsageByDay();

    // BookingDetail theo thang
    @Query("SELECT b.fieldid AS fieldId, FUNCTION('DATE_FORMAT', b.playdate, '%Y-%m') AS month, COUNT(b) AS total " +
           "FROM Bookingdetails b " +
           "GROUP BY b.fieldid, FUNCTION('DATE_FORMAT', b.playdate, '%Y-%m')")
    List<Map<String, Object>> countUsageByMonth();

	// booking Permanent
	@Query("SELECT p FROM PermanentBooking p")
	 List<PermanentBooking> findPermanentBookings();

    // Find bookings for a specific date - updated to handle java.util.Date
    @Query(value = "SELECT b.fieldid, f.namefield, COUNT(b.bookingdetailid) AS booking_count " +
            "FROM bookingdetails b " +
            "JOIN field f ON b.fieldid = f.fieldid " +
            "WHERE DATE_FORMAT(b.playdate, '%Y-%m-%d') = :date " +
            "GROUP BY b.fieldid, f.namefield", nativeQuery = true)
    List<Object[]> countBookingsByDate(@Param("date") String date);

    // Find bookings for a specific month - updated to handle java.util.Date
    @Query(value = "SELECT b.fieldid, f.namefield, COUNT(b.bookingdetailid) AS booking_count " +
            "FROM bookingdetails b " +
            "JOIN field f ON b.fieldid = f.fieldid " +
            "WHERE DATE_FORMAT(b.playdate, '%Y-%m') = :yearMonth " +
            "GROUP BY b.fieldid, f.namefield", nativeQuery = true)
    List<Object[]> countBookingsByMonth(@Param("yearMonth") String yearMonth);

    // Find permanent bookings active on a specific date - updated to handle LocalDate
    @Query(value = "SELECT p.field_id, f.namefield, COUNT(p.permanent_id) AS booking_count " +
            "FROM permanent_booking p " +
            "JOIN field f ON p.field_id = f.fieldid " +
            "WHERE :date BETWEEN DATE_FORMAT(p.start_date, '%Y-%m-%d') AND DATE_FORMAT(p.end_date, '%Y-%m-%d') " +
            "AND p.day_of_week = WEEKDAY(STR_TO_DATE(:date, '%Y-%m-%d')) + 1 " +
            "AND p.active = 1 " +
            "GROUP BY p.field_id, f.namefield", nativeQuery = true)
    List<Object[]> countPermanentBookingsByDate(@Param("date") String date);

    // Find permanent bookings active during a specific month - updated to handle LocalDate
    @Query(value = "SELECT p.field_id, f.namefield, " +
            "SUM(CASE WHEN LAST_DAY(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d')) < p.end_date THEN " +
            "    FLOOR(DATEDIFF(LAST_DAY(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d')), " +
            "           GREATEST(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d'), p.start_date))/7) + 1 " +
            "ELSE " +
            "    FLOOR(DATEDIFF(p.end_date, " +
            "           GREATEST(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d'), p.start_date))/7) + 1 " +
            "END) AS booking_count " +
            "FROM permanent_booking p " +
            "JOIN field f ON p.field_id = f.fieldid " +
            "WHERE (p.start_date <= LAST_DAY(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d'))) " +
            "  AND (p.end_date >= STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d')) " +
            "AND p.active = 1 " +
            "GROUP BY p.field_id, f.namefield", nativeQuery = true)
    List<Object[]> countPermanentBookingsByMonth(@Param("yearMonth") String yearMonth);
}