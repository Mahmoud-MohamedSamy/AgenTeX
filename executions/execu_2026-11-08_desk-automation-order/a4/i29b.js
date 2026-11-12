const s = JSON.parse(fs.readFileSync('../a4/i29.json'));
const L = arr((await api('GET', `/desk/tickets/${s.ticket}/replies`)).j?.data);
const b = String(L[0].body_html || L[0].body || L[0].html || L[0].content || JSON.stringify(L[0]));
const links = [...b.matchAll(/https?:\/\/[^"'\s<>]+/g)].map(m => m[0]);
const hl = links.filter(u => /happiness|rate|rating/i.test(u));
fs.writeFileSync('../a4/i29-links.json', JSON.stringify(hl));
log({ keys: Object.keys(L[0]), textStart: b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300), happinessLinks: hl.map(u => u.replace(/[A-Za-z0-9_-]{16,}/g, m => `<token len ${m.length}>`)) });
