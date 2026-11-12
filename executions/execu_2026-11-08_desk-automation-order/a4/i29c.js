const s = JSON.parse(fs.readFileSync('../a4/i29.json'));
const L0 = arr((await api('GET', `/desk/tickets/${s.ticket}/replies`)).j?.data)[0];
const tok = x => String(x || '').replace(/[A-Za-z0-9_-]{20,}/g, m => `<tok ${m.length}>`);
log('wf text tail', tok(L0.body_text).slice(-120));
// control: manual close of a fresh ticket (happiness ON, trigger on_close)
const t = await mkTicket('I29 ctrl', {}, 'manual close'); await sleep(4000);
const p = await patchTicket(t.id, { status: 'Closed' }); await sleep(20000);
const R = arr((await api('GET', `/desk/tickets/${t.id}/replies`)).j?.data);
fs.writeFileSync('../a4/i29c.json', JSON.stringify({ ctrl: t.id }));
log('ctrl', p.s, R.map(r => ({ subj: r.subject, st: r.status, hasRaw: /\{\{happiness\.link\}\}/.test(r.body_html + r.body_text), links: [...String(r.body_html).matchAll(/https?:\/\/[^"'\s<>]+/g)].map(m => tok(m[0])) })));
