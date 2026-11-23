const t0 = Date.now(); let r;
for (let i = 0; i < 12; i++) { r = await ask('Reply with OK'); if (r.error) break; await sleep(10000); }
return { secs: Math.round((Date.now() - t0) / 1000), err: r.error, text: (r.text || '').slice(0, 40) };
