const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8'));
const h = await api('GET', `/desk/tickets/${J.k1}/history`); const d = await api('GET', '/desk/tickets/' + J.k1);
return { s: h.s, n: L(h.j?.data).length, raw: h.t.slice(0, 1500).replace(/[\w.+-]+@[\w.-]+/g, '<mail>'), deskKeys: Object.entries(d.j?.data || {}).filter(([k]) => /status/i.test(k)) };
