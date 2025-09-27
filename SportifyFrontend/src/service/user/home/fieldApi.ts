// API functions for FieldPage and FieldDetails
export async function fetchFieldList() {
  const res = await fetch("http://localhost:8081/api/sportify/field");
  if (!res.ok) throw new Error('Failed to fetch fields');
  return res.json();
}

export async function fetchFieldDetail(idField: any) {
  const res = await fetch(`http://localhost:8081/api/sportify/field/detail/${idField}`);
  if (!res.ok) throw new Error('Failed to fetch field detail');
  return res.json();
}
