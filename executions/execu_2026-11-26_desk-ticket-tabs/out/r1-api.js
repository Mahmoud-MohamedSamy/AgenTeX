const out = {};
// membership
for (const [k, id] of [['CS', ST.CS], ['MK', ST.MK]]) { const r = await api.O('GET', `/desk/departments/${id}`); const a = r.j?.data?.agent_user_ids || r.j?.data?.department?.agent_user_ids || []; out['member ' + k] = { C: a.includes(ST.C_ID), O: a.includes(ST.O_ID), n: a.length }; }
// tickets
const t1 = await mkTicket('O', 'QA TT R main', { email: QA_EMAIL }); out.t1 = t1.s + ' #' + t1.num + (t1.err ? ' ' + t1.err : '');
const t2 = await mkTicket('O', 'QA TT R noemail'); out.t2 = t2.s + ' #' + t2.num + (t2.err ? ' ' + t2.err : '');
const t3 = await mkTicket('O', 'QA TT R mkt', { department: ST.MK }); out.t3 = t3.s + ' #' + t3.num + (t3.err ? ' ' + t3.err : '');
ST.R = { t1: t1.id, t2: t2.id, t3: t3.id, n1: t1.num, n2: t2.num, n3: t3.num }; saveState();
const id = t1.id;
const g0 = await api.O('GET', TK(id) + '/resolution'); out.getEmpty = E(g0) + ' ' + short(g0.j?.data, 200);
// R-02 empty
for (const b of [{ content_html: '' }, { content_html: '   ' }, { content_html: '<p></p>' }]) { const r = await api.O('PUT', TK(id) + '/resolution', b); out['R-02 ' + JSON.stringify(b)] = E(r); }
// R-03 add
const r3 = await api.O('PUT', TK(id) + '/resolution', { content_html: '<p>QA TT first resolution</p>', notify_customer: false });
out['R-03'] = E(r3) + ' ' + short(r3.j?.data, 400);
const g3 = await api.O('GET', TK(id) + '/resolution'); out['R-03 get'] = E(g3) + ' ' + short(g3.j?.data, 400);
// R-04 edit
const r4 = await api.O('PUT', TK(id) + '/resolution', { content_html: '<p>QA TT edited resolution</p>', notify_customer: false }); out['R-04'] = E(r4) + ' ' + short(r4.j?.data, 250);
// R-07 long/arabic/format/script
const long = '<p>' + 'QA TT long '.repeat(460) + '</p><p>حل المشكلة بنجاح</p><p><b>bold</b> <ul><li>item</li></ul> <a href="https://example.com">link</a></p><script>alert(1)</script><img src=x onerror=alert(2)>';
const r7 = await api.O('PUT', TK(id) + '/resolution', { content_html: long, notify_customer: false }); const g7 = await api.O('GET', TK(id) + '/resolution');
const html = JSON.stringify(g7.j?.data || '');
out['R-07'] = E(r7) + ' len=' + long.length + ' storedLen=' + html.length + ' script=' + /<script/i.test(html) + ' onerror=' + /onerror/i.test(html) + ' arabic=' + html.includes('حل المشكلة') + ' bold=' + /<b>|<strong>/.test(html);
const r7b = await api.O('PUT', TK(id) + '/resolution', { content_html: '<p>' + 'x'.repeat(70000) + '</p>' }); out['R-07 70k'] = E(r7b);
// put back normal text
await api.O('PUT', TK(id) + '/resolution', { content_html: '<p>QA TT edited resolution</p>', notify_customer: false });
// R-09 notify without email
const r9 = await api.O('PUT', TK(t2.id) + '/resolution', { content_html: '<p>QA TT notify no email</p>', notify_customer: true }); out['R-09'] = E(r9) + ' ' + short(r9.j?.data, 200);
const g9 = await api.O('GET', TK(t2.id) + '/resolution'); out['R-09 saved?'] = E(g9) + ' ' + short(g9.j?.data, 200);
// R-15 agent C
const c1 = await api.C('GET', TK(t3.id) + '/resolution'); out['R-15 C get mkt'] = E(c1);
const c2 = await api.C('PUT', TK(t3.id) + '/resolution', { content_html: '<p>QA TT by C mkt</p>' }); out['R-15 C put mkt'] = E(c2);
const c3 = await api.C('PUT', TK(t2.id) + '/resolution', { content_html: '<p>QA TT by C cs</p>' }); out['R-15 C put cs'] = E(c3);
const c4 = await api.C('DELETE', TK(t3.id) + '/resolution'); out['R-15 C delete mkt'] = E(c4);
// history
const h = await history(id); out.history = h.s + ' ' + h.items.map(x => x.event_type || x.type || x.kind || x.action).filter(Boolean).join(',').slice(0, 500);
return out;
