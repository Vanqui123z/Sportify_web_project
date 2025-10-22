package duan.sportify.utils;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GoogleCalanderEvent {
    @Value("${google.api.calendar.key}")
    private  String API_KEY;
    private final String CALENDAR_ID = "en.vietnamese%23holiday@group.v.calendar.google.com";

    public String getVietnamHolidays() {
        String url = "https://www.googleapis.com/calendar/v3/calendars/" + CALENDAR_ID + "/events?key=" + API_KEY;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, String.class);
    }
}
