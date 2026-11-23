const r = await stream('/agents/tia/turn/stream', { turn_id: 'qa-' + Date.now(), message: 'What can you help me with? Answer in one short sentence.' }, 90000);
fs.writeFileSync('../out/t0.json', JSON.stringify(r, null, 1));
return { status: r.status, types: r.types, error: r.error, firstMs: r.firstMs, totalMs: r.totalMs, text: (r.text||'').slice(0,300), finalKeys: r.final && Object.keys(r.final), notStream: r.notStream, j: r.j };
