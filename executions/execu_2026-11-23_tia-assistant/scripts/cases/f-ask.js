const Q = JSON.parse(process.env.QS); const out = [];
for (const q of Q) { const r = await ask(q); out.push(q.slice(0, 40) + ' => ' + (r.error || '') + ' ' + (r.text || r.final?.text || '').slice(0, 160)); }
return out;
