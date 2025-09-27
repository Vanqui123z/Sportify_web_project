// API functions for Event and EventDetail
export async function fetchEvents({ page = 0, size = 4, eventType = '', keyword = '' }) {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('size', String(size));
  if (eventType) params.append('eventType', eventType);
  if (keyword) params.append('keyword', keyword);
  const res = await fetch(`http://localhost:8081/api/sportify/event?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function fetchEventDetail(eventid:any) {
  const res = await fetch(`http://localhost:8081/api/sportify/eventdetail/${eventid}`);
  if (!res.ok) throw new Error('Failed to fetch event detail');
  return res.json();
}
