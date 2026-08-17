// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE: string = (import.meta as any).env?.VITE_API_URL ?? 'https://o5t5ellgkf.execute-api.us-east-1.amazonaws.com/prod'

export async function runScan(payload: { productName: string; stack: string[]; painPoints: string }) {
  const res = await fetch(`${API_BASE}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Scan failed: ${res.status}`)
  return res.json()
}
