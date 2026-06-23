// Memisah buffer SSE menjadi event JSON yang lengkap. Potongan terakhir yang
// belum diakhiri "\n\n" dikembalikan sebagai `rest` untuk digabung di read berikutnya.
export function parseSseBuffer(buffer) {
  const parts = buffer.split('\n\n');
  const rest = parts.pop() ?? '';
  const events = [];
  for (const part of parts) {
    const dataPayload = part
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .join('');
    if (!dataPayload) continue;
    try {
      events.push(JSON.parse(dataPayload));
    } catch {
      // Abaikan payload yang tidak bisa di-parse (tidak diharapkan untuk event lengkap).
    }
  }
  return { events, rest };
}
