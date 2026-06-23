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

// Konsumsi endpoint streaming SSE. Memanggil callback per event.
// Memakai fetch + ReadableStream karena axios tidak mengekspos body bertahap
// dan EventSource tidak mendukung POST/Authorization.
export async function streamSalesPage(payload, { token, signal, onChunk, onDone, onError }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  let res;
  try {
    res = await fetch(`${baseUrl}/sales-pages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') return;
    onError('Gagal menghubungi server.');
    return;
  }

  if (!res.ok) {
    let message = 'Gagal generate sales page.';
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      // body bukan JSON; pakai pesan default
    }
    onError(message);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const { events, rest } = parseSseBuffer(buffer);
      buffer = rest;
      for (const ev of events) {
        if (ev.chunk) onChunk(ev.chunk);
        else if (ev.done) onDone(ev);
        else if (ev.error) onError(ev.error);
      }
    }
    // Flush event terakhir yang mungkin tidak diakhiri "\n\n"
    if (buffer.trim()) {
      const { events } = parseSseBuffer(buffer + '\n\n');
      for (const ev of events) {
        if (ev.chunk) onChunk(ev.chunk);
        else if (ev.done) onDone(ev);
        else if (ev.error) onError(ev.error);
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') return;
    onError('Koneksi streaming terputus.');
  }
}
