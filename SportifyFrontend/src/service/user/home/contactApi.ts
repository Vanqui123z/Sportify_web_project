// API for Contact
export async function sendContact(payload: any) {
  const res = await fetch('http://localhost:8081/api/user/submit-contact', {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
