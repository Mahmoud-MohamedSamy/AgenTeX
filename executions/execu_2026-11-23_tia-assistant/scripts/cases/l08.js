const out = []; const t0 = Date.now();
for (let i = 1; i <= 14; i++) { const r = await stream('/agents/tia/turn/stream', { turn_id: crypto.randomUUID(), message: 'Reply with the number ' + i }); out.push(i + ':' + (r.status === 429 ? '429' : '') + (r.error || r.j?.error?.code || 'ok') + '@' + Math.round((Date.now() - t0) / 1000) + 's'); if (r.status === 429 || /RATE|LIMIT/.test(r.error || r.j?.error?.code || '')) break; }
return out;
