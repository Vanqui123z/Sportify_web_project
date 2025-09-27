// API for FootballPredictionPage
export async function fetchFootballPrediction() {
  const res = await fetch("http://localhost:8081/api/sportify/football-prediction");
  if (!res.ok) throw new Error('Failed to fetch football prediction');
  return res.json();
}
