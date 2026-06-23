import { describe, it, expect } from 'vitest';
import { parseSseBuffer } from './streamSalesPage';

describe('parseSseBuffer', () => {
  it('parses a single complete event and returns empty rest', () => {
    const buffer = 'data: {"chunk":"<h1>Hi</h1>"}\n\n';
    const { events, rest } = parseSseBuffer(buffer);
    expect(events).toEqual([{ chunk: '<h1>Hi</h1>' }]);
    expect(rest).toBe('');
  });

  it('keeps an incomplete trailing event in rest', () => {
    const buffer = 'data: {"chunk":"a"}\n\ndata: {"chunk":"b"';
    const { events, rest } = parseSseBuffer(buffer);
    expect(events).toEqual([{ chunk: 'a' }]);
    expect(rest).toBe('data: {"chunk":"b"');
  });

  it('parses multiple complete events in one buffer', () => {
    const buffer =
      'data: {"chunk":"a"}\n\ndata: {"done":true,"id":7,"sisa_credit":4}\n\n';
    const { events, rest } = parseSseBuffer(buffer);
    expect(events).toEqual([
      { chunk: 'a' },
      { done: true, id: 7, sisa_credit: 4 },
    ]);
    expect(rest).toBe('');
  });

  it('parses an error event', () => {
    const { events } = parseSseBuffer('data: {"error":"gagal"}\n\n');
    expect(events).toEqual([{ error: 'gagal' }]);
  });

  it('ignores blank blocks and non-data lines', () => {
    const { events, rest } = parseSseBuffer('\n\n: comment\n\ndata: {"chunk":"x"}\n\n');
    expect(events).toEqual([{ chunk: 'x' }]);
    expect(rest).toBe('');
  });
});
