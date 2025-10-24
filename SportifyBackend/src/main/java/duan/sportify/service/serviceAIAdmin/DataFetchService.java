package duan.sportify.service.serviceAIAdmin;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DataFetchService {
    private final RestTemplate restTemplate;

    public DataFetchService(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public List<FieldUsage> getFieldUsageByDate(LocalDate date) {
        String url = "http://localhost:8081/api/field-usage/active-fields/by-date?date=" + date;
        ResponseEntity<FieldUsage[]> response = restTemplate.getForEntity(url, FieldUsage[].class);
        return Arrays.asList(response.getBody());
    }

    public WeatherForecast getWeatherForecast() {
        String url = "http://localhost:8081/api/forecast/weather";
        return restTemplate.getForObject(url, WeatherForecast.class);
    }

    public List<HolidayEvent> getHolidays() {
        String url = "http://localhost:8081/api/forecast/holiday";
        ResponseEntity<HolidayEvent[]> response = restTemplate.getForEntity(url, HolidayEvent[].class);
        return Arrays.asList(response.getBody());
    }
}
