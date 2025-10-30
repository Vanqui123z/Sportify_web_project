// API functions for FieldPage and FieldDetails
export async function fetchFieldList() {
  const res = await fetch("http://localhost:8081/api/sportify/field");
  if (!res.ok) throw new Error('Failed to fetch fields');
  return res.json();
}

export async function fetchFieldsWithCoordinates() {
  const res = await fetch("http://localhost:8081/api/sportify/field/coordinates");
  if (!res.ok) throw new Error('Failed to fetch fields with coordinates');
  return res.json();
}

export async function fetchFieldDetail(idField: any) {
  const res = await fetch(`http://localhost:8081/api/sportify/field/detail/${idField}`);
  if (!res.ok) throw new Error('Failed to fetch field detail');
  return res.json();
}

export async function PosthandlePermanentBookingData(idField: any, bookingData: any) {
  const res = await fetch(`http://localhost:8081/api/user/field/permanent-booking/${idField}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) throw new Error('Failed to post permanent booking data');
  return res.json();
}
