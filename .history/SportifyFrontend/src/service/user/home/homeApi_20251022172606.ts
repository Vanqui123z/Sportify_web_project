// API functions for HomePage
export async function fetchHomeData(username?: string) {
  // Tạo URL với query parameter nếu có username
  const mainUrl = username 
    ? `http://localhost:8081/api/sportify?username=${encodeURIComponent(username)}`
    : "http://localhost:8081/api/sportify";
    
  const [mainResponse, eventResponse] = await Promise.all([
    fetch(mainUrl),
    fetch("http://localhost:8081/api/sportify/event")
  ]);
  if (!mainResponse.ok) throw new Error(`Main API error: ${mainResponse.status}`);
  if (!eventResponse.ok) throw new Error(`Event API error: ${eventResponse.status}`);
  const mainData = await mainResponse.json();
  const eventData = await eventResponse.json();
  return { mainData, eventData };
}
