const mid = await modId(); const o = {}; const LR = '65062122-a015-4101-abed-c6b1f53913ea';
// relative dates
for (const v of ['today', '${CURRENTTIME}', '${TODAY}']) { const r = await mkRule(mid, { name: P + ' Z13 ' + v.replace(/\W/g, ''), layoutId: LR, primaryField: 'qa_rt18_date', branches: [B(C('gt', 'qa_rt18_date', v), 'QA Z13')] }); o['date ' + v] = SR(r).slice(0, 220); if (r.j && r.j.data) o['date ' + v] += ' deleted ' + (await delRule(mid, r.j.data.id)).s; }
// function rule: other fields than url?
const fr = await mkRule(mid, { name: P + ' Z8 fn', layoutId: LR, primaryField: 'qa_rt18_text', kind: 'function', branches: [], function: { code: 'return {status:"success"}', language: 'deluge', timeoutMs: 2000 } }); o.fnCodeOnly = SR(fr).slice(0, 260); if (fr.j && fr.j.data) o.fnCodeOnly += ' deleted ' + (await delRule(mid, fr.j.data.id)).s;
// F10 internal URLs
for (const u of ['https://169.254.169.254/latest', 'https://localhost/x', 'https://10.0.0.5/x']) { const r = await mkRule(mid, { name: P + ' F10 ' + u.slice(8, 20).replace(/\W/g, ''), layoutId: LR, primaryField: 'qa_rt18_text', kind: 'function', branches: [], function: { url: u, timeoutMs: 2000, secret: 'qa-rt18-secret' } }); o['fn ' + u] = SR(r).slice(0, 200); if (r.j && r.j.data) o['fn ' + u] += ' deleted ' + (await delRule(mid, r.j.data.id)).s; }
// D20 all failing conditions: temp two branches on rText
const g = (await getRule(mid, I.rText)).j.data; const orig = g.branches;
const two = await putRule(mid, I.rText, { ...g, branches: [B(C('startsWith', 'qa_rt18v_text', 'BAD'), 'QA RT18 text cannot start with BAD'), B(C('contains', 'qa_rt18v_text', 'X9'), 'QA RT18 text cannot contain X9')] }); o.twoBranches = two.s;
const rec = await mkRec(mid, { first_name: 'QA', last_name: P + ' D20', qa_rt18v_text: 'BADX9' }, I.layout); o.d20 = rec.s + ' ' + JSON.stringify(rec.r.j && rec.r.j.error && rec.r.j.error.details.map(d => d.message));
const g2 = (await getRule(mid, I.rText)).j.data; o.restore = (await putRule(mid, I.rText, { ...g2, branches: orig })).s;
// Kanban (G6) and web forms (G12)
const kb = await api('GET', '/modules/' + mid + '/records?filters=lead_status&limit=5'); o.kanbanProbe = kb.s;
const wf = await api('GET', '/web-forms'); const forms = arr(wf.j && wf.j.data); o.webforms = wf.s + ' n=' + forms.length + ' keys=' + (forms[0] ? Object.keys(forms[0]).join(',').slice(0, 200) : '');
return o;
