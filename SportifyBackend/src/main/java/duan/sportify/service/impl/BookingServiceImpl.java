package duan.sportify.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;

import duan.sportify.DTO.ShiftDTO;
import duan.sportify.DTO.booking.BookingDetailDTO;
import duan.sportify.DTO.booking.BookingEventDTO;
import duan.sportify.Repository.PermanentBookingRepository;
import duan.sportify.dao.AuthorizedDAO;
import duan.sportify.dao.BookingDAO;
import duan.sportify.dao.BookingDetailDAO;

import duan.sportify.entities.Authorized;
import duan.sportify.entities.Bookingdetails;
import duan.sportify.entities.Bookings;
import duan.sportify.entities.PermanentBooking;
import duan.sportify.service.AuthorizedService;
import duan.sportify.service.BookingService;

import java.util.ArrayList;
import java.util.Date;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import javax.transaction.Transactional;

@SuppressWarnings("unused")
@Service
public class BookingServiceImpl implements BookingService {
    @Autowired
    private BookingDAO bookingDAO;

    @Autowired
    private BookingDetailDAO bookingDetailDAO;

    @Autowired
    private PermanentBookingRepository permanentBookingRepository;

    @Override
    public List<Bookings> findAll() {
        return bookingDAO.findAll();
    }

    @Override
    @Transactional
    public Bookings createBooking(String username, Double bookingprice, String phone,
            String note, int shiftid, int fieldid,
            Date playdate, Double priceField) {
        Bookings booking = new Bookings();
        booking.setUsername(username);
        booking.setBookingdate(new Date());
        booking.setBookingprice(bookingprice);
        booking.setPhone(phone);
        booking.setNote(note);
        booking.setBookingType("ONCE");
        booking.setBookingstatus("Đã Cọc");

        // Lưu booking
        Bookings savedBooking = bookingDAO.save(booking);

        // Tạo booking detail
        Bookingdetails detail = new Bookingdetails();
        detail.setBookingid(savedBooking.getBookingid());
        detail.setShiftid(shiftid);
        detail.setPlaydate(playdate);
        detail.setFieldid(fieldid);
        detail.setPrice(priceField);

        bookingDetailDAO.save(detail);

        return savedBooking;
    }

    @Override
    @Transactional
    public Bookings createBookingPermanent(String username, Double bookingprice, String phone,
            String note, List<ShiftDTO> shifts,
            Integer fieldId, Double priceField,
            LocalDate start_date, LocalDate end_date) {
        // Lưu booking chính

        Bookings booking = new Bookings();
        booking.setUsername(username);
        booking.setBookingdate(new Date());
        booking.setBookingprice(bookingprice);
        booking.setPhone(phone);
        booking.setNote(note);
        booking.setBookingType("PERMANENT");
        booking.setBookingstatus("Đã Cọc");

        Bookings savedBooking = bookingDAO.save(booking);
        // Lưu permanent booking details

        for (ShiftDTO shift : shifts) {
            PermanentBooking permanentDetail = new PermanentBooking();
            permanentDetail.setBookingId(savedBooking.getBookingid());
            permanentDetail.setDayOfWeek(shift.getDayOfWeek());
            permanentDetail.setStartDate(start_date);
            permanentDetail.setEndDate(end_date);
            permanentDetail.setFieldId(fieldId);
            permanentDetail.setShiftId(shift.getShiftId());
            permanentDetail.setActive(1);

            PermanentBooking savedPermanentDetail = permanentBookingRepository.save(permanentDetail);
        }

        return savedBooking;
    }

    @Override
    public List<Object[]> getPermanentBookingByBookingId(Integer bookingId) {
        return bookingDAO.getPermanentBookingByBookingId(bookingId);
    }

    @Override
    public Bookings create(Bookings bookings) {
        return bookingDAO.save(bookings);
    }

    @Override
    public Bookings update(Bookings bookings) {
        return bookingDAO.save(bookings);
    }

    @Override
    public void delete(Integer id) {
        bookingDAO.deleteById(id);
    }

    @Override
    public Bookings findByBookingid(Integer id) {
        return bookingDAO.findByBookingid(id);
    }

    @Override
    public List<Object[]> getBookingInfoByUsername(String username) {
        return bookingDAO.getBookingInfoByUsername(username);
    }

    @Override
    public List<Object[]> getBookingInfoByBookingDetail(Integer bookingid) {
        return bookingDAO.getBookingInfoByBookingDetail(bookingid);
    }

    @Override
    public int countBooking() {
        return bookingDAO.countBooking();
    }

    @Override
    public List<BookingEventDTO> getCalendarEvents() {
        List<BookingEventDTO> result = new ArrayList<>();

        // ONCE
        for (Object[] row : bookingDAO.findBookingOnceEvents()) {
            Integer bookingId = (Integer) row[0];
            String fieldName = (String) row[1];
            String shiftName = (String) row[2];
            LocalDate playDate = ((java.sql.Date) row[3]).toLocalDate();
            LocalTime startTime = ((java.sql.Time) row[4]).toLocalTime();
            LocalTime endTime = ((java.sql.Time) row[5]).toLocalTime();

            LocalDateTime start = LocalDateTime.of(playDate, startTime);
            LocalDateTime end = LocalDateTime.of(playDate, endTime);

            result.add(new BookingEventDTO(
                    bookingId,
                    fieldName ,
                    shiftName,
                    start,
                    end,
                    null,
                    "ONCE"));
        }

        // PERMANENT
        for (Object[] row : bookingDAO.findBookingPermanentEvents()) {
            Integer bookingId = (Integer) row[0];
            String fieldName = (String) row[1];
            String shiftName = (String) row[2];
            LocalDate startDate = ((java.sql.Date) row[3]).toLocalDate();
            LocalDate endDate = ((java.sql.Date) row[4]).toLocalDate();

            // fix lỗi cast String -> Integer
            Integer dayOfWeek = null;
            if (row[5] != null) {
                if (row[5] instanceof Integer) {
                    dayOfWeek = (Integer) row[5];
                } else {
                    dayOfWeek = Integer.parseInt(row[5].toString());
                }
            }
            // dayTime
            LocalTime startTime = ((java.sql.Time) row[6]).toLocalTime();
            LocalTime endTime = ((java.sql.Time) row[7]).toLocalTime();
            LocalDateTime start = LocalDateTime.of(startDate, startTime);
            LocalDateTime end = LocalDateTime.of(endDate, endTime);

            result.add(new BookingEventDTO(
                    bookingId,
                    fieldName,
                    shiftName,
                    start,
                    end,
                    dayOfWeek,
                    "PERMANENT"));
        }

        return result;
    }

        public List<BookingDetailDTO> getBookingDetail(Integer bookingId) {
    List<Object[]> rows = bookingDAO.findBookingDetail(bookingId);
    if (rows == null || rows.isEmpty()) return new ArrayList<>();

    List<BookingDetailDTO> details = new ArrayList<>();
    for (Object[] row : rows) {
        details.add(new BookingDetailDTO(
            (Integer) row[0], // bookingId
            (String) row[1],  // username
            (String) row[2],  // phone
            (String) row[3],  // note
            (String) row[4],  // bookingStatus
            (String) row[5],  // bookingType
            (String) row[6],  // fieldName
            (String) row[7],  // fieldImage
            (String) row[8],  // shiftName
            ((java.sql.Time) row[9]).toLocalTime(),   // shiftStart
            ((java.sql.Time) row[10]).toLocalTime(),  // shiftEnd
            (Double) row[11], // price
            row[12] != null ? ((java.sql.Date) row[12]).toLocalDate() : null, // playDate
            row[13] != null ? ((java.sql.Date) row[13]).toLocalDate() : null, // startDate
            row[14] != null ? ((java.sql.Date) row[14]).toLocalDate() : null, // endDate
            row[15] != null
                ? (row[15] instanceof Integer
                    ? (Integer) row[15]
                    : Integer.parseInt(row[15].toString()))
                : null
                
        ));
        System.out.println("row[11]"    + row[11]);
    }
    return details;
}


}
