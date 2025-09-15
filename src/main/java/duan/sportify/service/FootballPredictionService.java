package duan.sportify.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class FootballPredictionService {
    
    private final RestTemplate restTemplate;
    private final FootballDataService footballDataService;
    
    @Autowired
    public FootballPredictionService(FootballDataService footballDataService) {
        this.restTemplate = new RestTemplate();
        this.footballDataService = footballDataService;
    }
    
    /**
     * Lấy danh sách trận đấu sắp tới từ Football-Data.org API
     * Tích hợp với AI prediction engine
     */
    public List<Map<String, Object>> getUpcomingMatches() {
        System.out.println("🚀 FootballPredictionService: Getting matches with AI predictions...");
        
        try {
            // Lấy dữ liệu trận đấu từ Football-Data.org
            List<Map<String, Object>> matches = footballDataService.getUpcomingMatches();
            
            // Enhance với AI predictions
            for (Map<String, Object> match : matches) {
                enhanceWithAIPrediction(match);
            }
            
            System.out.println("✅ Successfully processed " + matches.size() + " matches with AI predictions");
            return matches;
            
        } catch (Exception e) {
            System.err.println("❌ Error in FootballPredictionService: " + e.getMessage());
            e.printStackTrace();
            
            // Return fallback data with basic predictions
            return getFallbackMatchesWithPredictions();
        }
    }
    
    /**
     * Dự đoán kết quả trận đấu dựa trên thống kê
     * TODO: Implement AI prediction algorithm using sports API data
     */
    public Map<String, Object> predictMatch(Long matchId) {
        Map<String, Object> prediction = new HashMap<>();
        
        // Placeholder prediction logic
        prediction.put("matchId", matchId);
        prediction.put("confidence", 75);
        prediction.put("predictedResult", "Home Win");
        prediction.put("recommendedBet", "1X");
        prediction.put("analysis", "Đội chủ nhà có phong độ tốt hơn trong 5 trận gần đây");
        
        return prediction;
    }
    
    /**
     * Lấy thống kê đội bóng từ API
     * TODO: Integrate with SportMonks/ESPN API
     */
    public Map<String, Object> getTeamStats(String teamName) {
        Map<String, Object> stats = new HashMap<>();
        
        // Placeholder team statistics
        stats.put("teamName", teamName);
        stats.put("gamesPlayed", 10);
        stats.put("wins", 6);
        stats.put("draws", 2);
        stats.put("losses", 2);
        stats.put("goalsFor", 18);
        stats.put("goalsAgainst", 8);
        stats.put("form", Arrays.asList("W", "W", "D", "W", "L"));
        
        return stats;
    }
    
    /**
     * Lấy dữ liệu lịch sử đối đầu
     * TODO: Implement head-to-head data from FIFA API
     */
    public List<Map<String, Object>> getHeadToHeadData(String team1, String team2) {
        List<Map<String, Object>> h2hData = new ArrayList<>();
        
        // Placeholder head-to-head data
        Map<String, Object> match = new HashMap<>();
        match.put("date", "2024-03-15");
        match.put("homeTeam", team1);
        match.put("awayTeam", team2);
        match.put("homeScore", 2);
        match.put("awayScore", 1);
        match.put("result", "Home Win");
        h2hData.add(match);
        
        return h2hData;
    }
    
    /**
     * Enhance match data với AI prediction
     */
    private void enhanceWithAIPrediction(Map<String, Object> match) {
        try {
            String homeTeam = (String) match.get("homeTeam");
            String awayTeam = (String) match.get("awayTeam");
            
            // AI analysis based on team strength and recent form
            Map<String, Object> aiAnalysis = generateAIAnalysis(homeTeam, awayTeam);
            
            // Add AI predictions to match
            match.put("aiConfidence", aiAnalysis.get("confidence"));
            match.put("predictedScore", aiAnalysis.get("predictedScore"));
            match.put("aiAnalysis", aiAnalysis.get("analysis"));
            match.put("recommendation", aiAnalysis.get("recommendation"));
            
            System.out.println("🧠 AI Enhanced: " + homeTeam + " vs " + awayTeam + " (" + aiAnalysis.get("confidence") + "% confidence)");
            
        } catch (Exception e) {
            System.err.println("Error enhancing match with AI: " + e.getMessage());
        }
    }
    
    /**
     * Generate AI analysis for a match
     */
    private Map<String, Object> generateAIAnalysis(String homeTeam, String awayTeam) {
        Map<String, Object> analysis = new HashMap<>();
        
        // Team strength mapping (can be enhanced with real data)
        Map<String, Integer> teamStrengths = new HashMap<>();
        teamStrengths.put("Manchester City", 95);
        teamStrengths.put("Arsenal", 90);
        teamStrengths.put("Liverpool", 88);
        teamStrengths.put("Manchester United", 82);
        teamStrengths.put("Chelsea", 80);
        teamStrengths.put("Tottenham Hotspur", 78);
        teamStrengths.put("Newcastle United", 75);
        teamStrengths.put("Brighton & Hove Albion", 70);
        
        int homeStrength = teamStrengths.getOrDefault(homeTeam, 65);
        int awayStrength = teamStrengths.getOrDefault(awayTeam, 65);
        
        // Home advantage
        homeStrength += 5;
        
        // Calculate probabilities
        int totalStrength = homeStrength + awayStrength;
        int homeWinProb = (homeStrength * 60) / totalStrength;
        int awayWinProb = (awayStrength * 60) / totalStrength;
        int drawProb = 100 - homeWinProb - awayWinProb;
        
        // Predict score
        String predictedScore = generatePredictedScore(homeStrength, awayStrength);
        
        // Generate analysis text
        String analysisText = generateAnalysisText(homeTeam, awayTeam, homeStrength, awayStrength);
        
        // Generate recommendation
        String recommendation = generateRecommendation(homeWinProb, drawProb, awayWinProb);
        
        // Calculate confidence
        int confidence = Math.min(95, Math.max(60, Math.abs(homeStrength - awayStrength) + 60));
        
        analysis.put("confidence", confidence);
        analysis.put("predictedScore", predictedScore);
        analysis.put("analysis", analysisText);
        analysis.put("recommendation", recommendation);
        
        return analysis;
    }
    
    private String generatePredictedScore(int homeStrength, int awayStrength) {
        Random random = new Random();
        
        int homeGoals = (homeStrength / 30) + random.nextInt(2);
        int awayGoals = (awayStrength / 35) + random.nextInt(2);
        
        // Ensure realistic scores
        homeGoals = Math.min(4, Math.max(0, homeGoals));
        awayGoals = Math.min(4, Math.max(0, awayGoals));
        
        return homeGoals + "-" + awayGoals;
    }
    
    private String generateAnalysisText(String homeTeam, String awayTeam, int homeStrength, int awayStrength) {
        if (homeStrength > awayStrength + 10) {
            return homeTeam + " có lợi thế lớn với phong độ tốt và sân nhà";
        } else if (awayStrength > homeStrength + 5) {
            return awayTeam + " có phong độ ấn tượng, có thể thắng dù chơi sân khách";
        } else {
            return "Trận đấu cân bằng, cả hai đội có cơ hội chiến thắng";
        }
    }
    
    private String generateRecommendation(int homeWin, int draw, int awayWin) {
        if (homeWin > 50) return "Cược Thắng Chủ Nhà";
        if (awayWin > 45) return "Cược Thắng Khách";
        if (draw > 35) return "Cược Hòa";
        return "Cược Cả Hai Ghi Bàn";
    }
    
    /**
     * Fallback matches với AI predictions
     */
    private List<Map<String, Object>> getFallbackMatchesWithPredictions() {
        List<Map<String, Object>> matches = new ArrayList<>();
        
        String[][] fallbackData = {
            {"Manchester United", "Liverpool"},
            {"Chelsea", "Arsenal"},
            {"Manchester City", "Tottenham Hotspur"},
            {"Newcastle United", "Brighton & Hove Albion"}
        };
        
        for (int i = 0; i < fallbackData.length; i++) {
            Map<String, Object> match = new HashMap<>();
            match.put("id", (long)(i + 1));
            match.put("homeTeam", fallbackData[i][0]);
            match.put("awayTeam", fallbackData[i][1]);
            match.put("date", "2024-09-" + (15 + i));
            match.put("time", (19 + i) + ":30");
            match.put("competition", "Premier League");
            match.put("homeTeamLogo", "/user/images/team-default.png");
            match.put("awayTeamLogo", "/user/images/team-default.png");
            
            // Add AI predictions
            enhanceWithAIPrediction(match);
            
            matches.add(match);
        }
        
        return matches;
    }
}
