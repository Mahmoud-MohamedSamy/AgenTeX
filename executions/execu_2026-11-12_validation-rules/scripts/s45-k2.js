const mid = await modId(); const L = I.layout; const isDesk = APP === 'desk';
const name = P + ' K2 <img src=x onerror=alert(1)> "q\' <b>bold</b>';
const r = await mkRule(mid, { name, description: '<script>alert(2)</script>', layoutId: L, primaryField: 'qa_vr_url', branches: [B(C(isDesk ? 'contains' : 'regexMatches', 'qa_vr_url', isDesk ? '<script>' : '^<script>alert\(3\)</script>"\'$'), 'QA K2 <i>msg</i> <img src=y onerror=alert(4)>')] });
if (r.s >= 300) return SR(r);
I.k2 = r.j.data.id; SAVE(); const g = (await getRule(mid, r.j.data.id)).j.data;
const ev = await api('GET', '/audit/events?entity_type=validation_rule&limit=30'); const hit = arr(ev.j && ev.j.data).find(e => JSON.stringify(e).includes(r.j.data.id));
return `stored name exact=${g.name === name}; message kept=${g.branches[0].message.en.includes('<i>msg</i>')}; audit event=${!!hit} ${hit ? JSON.stringify(hit).slice(0, 300) : ev.s}`;
