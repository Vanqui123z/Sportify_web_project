package duan.sportify.service.serviceAIAdmin;
import duan.sportify.DTO.APIOutside.ForecastResult;
import duan.sportify.DTO.APIOutside.FieldUsage;
import duan.sportify.DTO.APIOutside.HolidayEvent;
import duan.sportify.DTO.APIOutside.WeatherForecast;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ForecastService {

    @Autowired
    DataFetchService dataFetchService;
    @Autowired
    FeatureEngineeringService featureService;
    @Autowired
    ModelService modelService;

  

    public List<ForecastResult> forecastNextWeek() throws Exception {
        // gọi Service để lấy dữ liệu từ API ngoài
        //yearMonth = 2025/10
        String yearMonth =  LocalDate.now().toString().substring(0,7);
        List<FieldUsage> usageMonth = dataFetchService.getFieldUsageByMonth(yearMonth);
        List<FieldUsage> usageToday = dataFetchService.getFieldUsageByDate(LocalDate.now());
        WeatherForecast weather = dataFetchService.getWeatherForecast();
        List<HolidayEvent> holidays = dataFetchService.getHolidays();

        System.out.println("usageMonth: " + usageMonth);
        System.out.println("usageToday: " + usageToday);
        System.out.println("weather: " + weather);
        System.out.println("holidays: " + holidays);

        List<ForecastResult> results = new ArrayList<>();
        // weather
        for (int i = 0; i < 7; i++) {
            LocalDate targetDate = LocalDate.now().plusDays(i + 1);
            WeatherForecast.ForecastDay weatherDay = weather.getForecast().stream()
                    .filter(f -> f.getDate().equals(targetDate.toString()))
                    .findFirst()
                    .orElse(weather.getForecast().get(0)); 
            // holiday
            boolean isHoliday = featureService.isHoliday(targetDate, holidays);

            // build feature vector
            for (FieldUsage field : usageMonth) {
                float[] featureVec = featureService.buildFeatureVector(
                    field, 
                    weatherDay, 
                    isHoliday
                );
                // nạp ONNX model, chạy inference → kết quả dự đoán
                float predicted = modelService.predictSingle(featureVec);

                results.add(new ForecastResult(
                        field.getFieldId(),
                        field.getFieldName(),
                        targetDate.toString(),
                        (Math.floor(predicted))
                ));
            }
        }

        return results;
    }
}
