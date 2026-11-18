const PH='agent-personal';
const Z6 = '1499272000000451805'; const pr = async (m, p, b) => { const r = await api(page, m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 110) : ''); };
await page.waitForTimeout(5000);
out.get = await pr('GET', 'tickets/' + Z6); out.priority = await pr('PATCH', 'tickets/' + Z6, { priority: 'High' });
out.comment = await pr('POST', 'tickets/' + Z6 + '/comments', { content: 'QA AC agent2 comment on agent1 ticket (' + PH + ')', isPublic: false });
const a = (await api(page, 'GET', 'tickets/' + Z6)).j; out.now = a && a.priority;
