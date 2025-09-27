// API for FootballTestPage
export async function fetchFootballTest() {
  const res = await fetch("http://localhost:8081/api/sportify/football-test");
  if (!res.ok) throw new Error('Failed to fetch football test');
  return res.json();
}
