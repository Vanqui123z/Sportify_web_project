package duan.sportify.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.BiFunction;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import duan.sportify.DTO.booking.FieldManagerDTO;
import duan.sportify.DTO.booking.FieldManagerDetailDTO;
import duan.sportify.dao.BookingDetailDAO;
import duan.sportify.entities.PermanentBooking;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FieldManagerService {

    private final BookingDetailDAO bookingRepo;
    @Autowired
    private  BookingDetailDAO permanentRepo;

    // Helper method to convert java.util.Date to LocalDate
    private LocalDate convertToLocalDate(Date dateToConvert) {
        return dateToConvert.toInstant()
            .atZone(ZoneId.systemDefault())
            .toLocalDate();
    }
    
    // Helper method to convert string date to proper format
    private String formatDateString(String date) {
        // Assuming input is in format "yyyy-MM-dd" or "dd/MM/yyyy"
        if (date.contains("/")) {
            String[] parts = date.split("/");
            if (parts.length == 3) {
                return parts[2] + "-" + (parts[1].length() == 1 ? "0" + parts[1] : parts[1]) + "-" + 
                       (parts[0].length() == 1 ? "0" + parts[0] : parts[0]);
            }
        }
        return date; // Return as is if already in correct format
    }

    // Hàm dùng chung để đếm usage
    private Map<String, Long> countUsage(
            List<Map<String, Object>> bookingData,
            List<PermanentBooking> permanents,
            BiFunction<LocalDate, PermanentBooking, String> keyGenerator) {

        Map<String, Long> counter = new HashMap<>();

        // Đếm từ bảng bookingdetail
        for (Map<String, Object> item : bookingData) {
            Long fieldId = ((Number) item.get("fieldId")).longValue();
            String dateOrMonth = item.get("date") != null
                    ? item.get("date").toString().substring(0, 10)
                    : item.get("month").toString();
            Long total = ((Number) item.get("total")).longValue();
            String key = fieldId + "_" + dateOrMonth;
            counter.put(key, counter.getOrDefault(key, 0L) + total);
        }

        // Đếm từ bảng permanent_booking
        for (PermanentBooking p : permanents) {
            LocalDate start = p.getStartDate();
            LocalDate end = p.getEndDate();
            int targetDay = p.getDayOfWeek();

            for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
                if (date.getDayOfWeek().getValue() == targetDay) {
                    String key = keyGenerator.apply(date, p);
                    counter.put(key, counter.getOrDefault(key, 0L) + 1);
                }
            }
        }
        return counter;
    }

    // Đếm theo ngày
    public List<FieldManagerDTO> getUsageByDay() {
        Map<String, Long> counter = countUsage(
                bookingRepo.countUsageByDay(),
                permanentRepo.findPermanentBookings(),
                (date, p) -> p.getFieldId() + "_" + date.toString()
        );

        return counter.entrySet().stream()
                .map(e -> {
                    String[] parts = e.getKey().split("_");
                    return new FieldManagerDTO(Long.parseLong(parts[0]), parts[1], e.getValue());
                })
                .sorted(Comparator.comparing(FieldManagerDTO::getDate))
                .toList();
    }

    // Đếm theo tháng
    public List<FieldManagerDTO> getUsageByMonth() {
        Map<String, Long> counter = countUsage(
                bookingRepo.countUsageByMonth(),
                permanentRepo.findPermanentBookings(),
                (date, p) -> p.getFieldId() + "_" + date.format(DateTimeFormatter.ofPattern("yyyy-MM"))
        );

        return counter.entrySet().stream()
                .map(e -> {
                    String[] parts = e.getKey().split("_");
                    return new FieldManagerDTO(Long.parseLong(parts[0]), parts[1], e.getValue());
                })
                .sorted(Comparator.comparing(FieldManagerDTO::getDate))
                .toList();
    }

    // Tổng số lượt đặt sân trong ngày
    public Long getTotalUsageByDay() {
        return getUsageByDay().stream()
                .mapToLong(FieldManagerDTO:: getTotal)
                .sum();
    }
    // Tổng số lượt đặt sân trong tháng
    public Long getTotalUsageByMonth() {
        return getUsageByMonth().stream()
                .mapToLong(FieldManagerDTO::getTotal)
                .sum();
    }

    /**
     * Get detailed field usage statistics for a specific date
     * @param date Format: yyyy-MM-dd or dd/MM/yyyy
     * @return List of field usage details
     */
    public List<FieldManagerDetailDTO> getDetailedUsageByDate(String date) {
        String formattedDate = formatDateString(date);
        Map<Integer, FieldManagerDetailDTO> fieldUsageMap = new HashMap<>();
        
        // Process one-time bookings
        List<Object[]> oneTimeBookings = bookingRepo.countBookingsByDate(formattedDate);
        for (Object[] booking : oneTimeBookings) {
            Integer fieldId = (Integer) booking[0];
            String fieldName = (String) booking[1];
            Long count = ((Number) booking[2]).longValue();
            
            fieldUsageMap.putIfAbsent(fieldId, new FieldManagerDetailDTO(fieldId, fieldName, 0L, 0L, 0L));
            FieldManagerDetailDTO dto = fieldUsageMap.get(fieldId);
            dto.setOneTimeBookings(count);
            dto.setTotalBookings(dto.getOneTimeBookings() + dto.getPermanentBookings());
        }
        
        // Process permanent bookings
        List<Object[]> permanentBookings = bookingRepo.countPermanentBookingsByDate(formattedDate);
        for (Object[] booking : permanentBookings) {
            Integer fieldId = (Integer) booking[0];
            String fieldName = (String) booking[1];
            Long count = ((Number) booking[2]).longValue();
            
            fieldUsageMap.putIfAbsent(fieldId, new FieldManagerDetailDTO(fieldId, fieldName, 0L, 0L, 0L));
            FieldManagerDetailDTO dto = fieldUsageMap.get(fieldId);
            dto.setPermanentBookings(count);
            dto.setTotalBookings(dto.getOneTimeBookings() + dto.getPermanentBookings());
        }
        
        return new ArrayList<>(fieldUsageMap.values());
    }
    
    /**
     * Get detailed field usage statistics for a specific month
     * @param yearMonth Format: yyyy-MM or MM/yyyy
     * @return List of field usage details
     */
    public List<FieldManagerDetailDTO> getDetailedUsageByMonth(String yearMonth) {
        // Convert MM/yyyy to yyyy-MM if needed
        String formattedYearMonth = yearMonth;
        if (yearMonth.contains("/")) {
            String[] parts = yearMonth.split("/");
            if (parts.length == 2) {
                formattedYearMonth = parts[1] + "-" + (parts[0].length() == 1 ? "0" + parts[0] : parts[0]);
            }
        }
        
        Map<Integer, FieldManagerDetailDTO> fieldUsageMap = new HashMap<>();
        
        // Process one-time bookings
        List<Object[]> oneTimeBookings = bookingRepo.countBookingsByMonth(formattedYearMonth);
        for (Object[] booking : oneTimeBookings) {
            Integer fieldId = (Integer) booking[0];
            String fieldName = (String) booking[1];
            Long count = ((Number) booking[2]).longValue();
            
            fieldUsageMap.putIfAbsent(fieldId, new FieldManagerDetailDTO(fieldId, fieldName, 0L, 0L, 0L));
            FieldManagerDetailDTO dto = fieldUsageMap.get(fieldId);
            dto.setOneTimeBookings(count);
            dto.setTotalBookings(dto.getOneTimeBookings() + dto.getPermanentBookings());
        }
        
        // Process permanent bookings
        List<Object[]> permanentBookings = bookingRepo.countPermanentBookingsByMonth(formattedYearMonth);
        for (Object[] booking : permanentBookings) {
            Integer fieldId = (Integer) booking[0];
            String fieldName = (String) booking[1];
            Long count = ((Number) booking[2]).longValue();
            
            fieldUsageMap.putIfAbsent(fieldId, new FieldManagerDetailDTO(fieldId, fieldName, 0L, 0L, 0L));
            FieldManagerDetailDTO dto = fieldUsageMap.get(fieldId);
            dto.setPermanentBookings(count);
            dto.setTotalBookings(dto.getOneTimeBookings() + dto.getPermanentBookings());
        }
        
        return new ArrayList<>(fieldUsageMap.values());
    }
}
