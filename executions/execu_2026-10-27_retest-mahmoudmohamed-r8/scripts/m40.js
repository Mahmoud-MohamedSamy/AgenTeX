// NDC-1797: delete forever ONE orphan item from our own wave-5 test module (qa_w5_auto_442716 no longer exists): QA W5 R1, id aca36754-78e5-48d4-8f60-41d10625e614.
const id = 'aca36754-78e5-48d4-8f60-41d10625e614'; const out = {};
const d = await api('POST', '/audit/recycle-bin/delete', { ids: [id] }); out.deleteForever = d.s + ' ' + d.t.slice(0, 300);
const b = await api('GET', `/audit/recycle-bin/items?app_key=crm&limit=200`); out.stillInBin = arr(b.j?.data).some(x => x.id === id);
return done(out);
