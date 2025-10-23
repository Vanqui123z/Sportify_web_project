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

	// Find active fields for a specific date with booking counts
	@Query(value = """
			SELECT f.fieldid, f.namefield,f.image,
			       COUNT(DISTINCT bd.bookingdetailid) AS one_time_bookings,
			       COUNT(DISTINCT pb.permanent_id) AS permanent_bookings,
			       (COUNT(DISTINCT bd.bookingdetailid) + COUNT(DISTINCT pb.permanent_id)) AS total_bookings
			FROM field f
			LEFT JOIN bookingdetails bd
			       ON f.fieldid = bd.fieldid
			       AND DATE_FORMAT(bd.playdate, '%Y-%m-%d') = :date
			LEFT JOIN permanent_booking pb
			       ON f.fieldid = pb.field_id
			       AND pb.start_date <= :date
			       AND pb.end_date >= :date
			       AND pb.day_of_week = DAYOFWEEK(STR_TO_DATE(:date, '%Y-%m-%d'))
			       AND pb.active = 1
			GROUP BY f.fieldid, f.namefield
			""", nativeQuery = true)
	List<Object[]> findActiveFieldsByDate(@Param("date") String date);

	// Find active fields for a specific month with booking counts - updated to
	// include boundary days
	@Query(value = "SELECT f.fieldid, f.namefield,f.image, " +
			"COUNT(DISTINCT bd.bookingdetailid) AS one_time_bookings, " +
			"SUM(CASE WHEN pb.permanent_id IS NOT NULL THEN " +
			"    FLOOR(LEAST(DATEDIFF(LAST_DAY(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d')), " +
			"           GREATEST(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d'), pb.start_date)) / 7, " +
			"           DATEDIFF(pb.end_date, GREATEST(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d'), pb.start_date)) / 7) + 1) "
			+
			"ELSE 0 END) AS permanent_bookings, " +
			"(COUNT(DISTINCT bd.bookingdetailid) + " +
			"SUM(CASE WHEN pb.permanent_id IS NOT NULL THEN " +
			"    FLOOR(LEAST(DATEDIFF(LAST_DAY(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d')), " +
			"           GREATEST(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d'), pb.start_date)) / 7, " +
			"           DATEDIFF(pb.end_date, GREATEST(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d'), pb.start_date)) / 7) + 1) "
			+
			"ELSE 0 END)) AS total_bookings " +
			"FROM field f " +
			"LEFT JOIN bookingdetails bd ON f.fieldid = bd.fieldid AND DATE_FORMAT(bd.playdate, '%Y-%m') = :yearMonth "
			+
			"LEFT JOIN permanent_booking pb ON f.fieldid = pb.field_id " +
			"AND (pb.start_date <= LAST_DAY(STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d'))) " +
			"AND (pb.end_date >= STR_TO_DATE(CONCAT(:yearMonth, '-01'), '%Y-%m-%d')) " +
			"AND pb.active = 1 " +
			"GROUP BY f.fieldid, f.namefield", nativeQuery = true)
	List<Object[]> findActiveFieldsByMonth(@Param("yearMonth") String yearMonth);
}