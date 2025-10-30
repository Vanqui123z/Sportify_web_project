package duan.sportify.service.serviceAIAdmin;
import duan.sportify.DTO.APIOutside.FieldUsage;
import duan.sportify.DTO.APIOutside.HolidayEvent;
import duan.sportify.DTO.APIOutside.WeatherForecast;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class FeatureEngineeringService {

    public float[] buildFeatureVector(FieldUsage field, WeatherForecast.ForecastDay weather, boolean isHoliday) {
        // ví dụ mô hình có các feature:
        // [totalBookings_today, avgtempC, dailyChanceOfRain, isHoliday]
        float totalBookingsDay = field.getTotalBookingsDay();
        float totalBookingsMonth = field.getTotalBookingsMonth();
        float avgTemp = (float) weather.getAvgtempC();
        float rain = (float) weather.getDailyChanceOfRain();
        float holidayFlag = isHoliday ? 1f : 0f;

        return new float[]{ totalBookingsMonth, avgTemp, rain, holidayFlag};
    }

    public boolean isHoliday(LocalDate date, List<HolidayEvent> holidays) {
        return holidays.stream().anyMatch(h ->
            !date.isBefore(LocalDate.parse(h.getStartDate())) &&
            !date.isAfter(LocalDate.parse(h.getEndDate()))
        );
    }
}
