const Y5 = '1499272000000493178'; const pr = async (m, p, b) => { const r = await api(page, m, p, b); return r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 110) : ''); };
await page.waitForTimeout(5000);
out.get = await pr('GET', 'tickets/' + Y5); out.edit = await pr('PATCH', 'tickets/' + Y5, { priority: PRI }); out.comment = await pr('POST', 'tickets/' + Y5 + '/comments', { content: 'QA AC2 peer comment', isPublic: false });
const t = (await api(page, 'GET', 'tickets/' + Y5)).j; out.pri = t && t.priority;
