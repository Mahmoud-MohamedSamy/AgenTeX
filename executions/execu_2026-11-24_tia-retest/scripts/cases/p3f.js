// Group F — chat history (Owner, API).
const o = {}; const C = '/agents/tia/conversations';
// F-04 continue context + F-07 across apps
let r = await ask('Remember this code for later: QA-P3-ORCHID. Just say OK.', { page: { app: 'crm' } }); const conv = r.final?.conversation_id;
r = await ask('What code did I ask you to remember?', { page: { app: 'desk' }, conversation_id: conv }); o.F04_07 = tiaText(r).slice(0, 200);
p3rec('F-04', /ORCHID/.test(o.F04_07) ? 'Pass' : 'Fail', `started in CRM, continued in Desk: ${o.F04_07}`, { conv });
// F-01 rename
const pr = await api('PATCH', `${C}/${conv}`, { title: 'QA TIA P3 renamed chat' }); const l1 = arr((await api('GET', `${C}?limit=50`)).j?.data).find(x => x.id === conv);
p3rec('F-01', '?', `rename=${pr.s} ${(pr.j?.error?.code || '')}; title now=${l1?.title}`);
// F-03 search
const sr = await api('GET', `${C}?q=ORCHID&limit=20`); const sr2 = await api('GET', `${C}?search=renamed&limit=20`);
p3rec('F-03', '?', `?q= → ${sr.s} n=${arr(sr.j?.data).length} hit=${arr(sr.j?.data).some(x => x.id === conv)}; ?search= → ${sr2.s} n=${arr(sr2.j?.data).length} hit=${arr(sr2.j?.data).some(x => x.id === conv)}; total list=${arr((await api('GET', `${C}?limit=50`)).j?.data).length}`);
// F-06 two sends at once in the same chat
const [a, b] = await Promise.all([ask('QA P3 parallel message A: reply A.', { page: { app: 'crm' }, conversation_id: conv }), ask('QA P3 parallel message B: reply B.', { page: { app: 'crm' }, conversation_id: conv })]);
const msgs = arr((await api('GET', `${C}/${conv}/messages?limit=50`)).j?.data); const users = msgs.filter(m => m.role === 'user').map(m => (m.text || '').slice(0, 30));
p3rec('F-06', '?', `A: ${a.status} ${a.error || ''} "${tiaText(a).slice(0, 60)}" | B: ${b.status} ${b.error || ''} "${tiaText(b).slice(0, 60)}" | user messages saved: ${JSON.stringify(users)}`);
// F-05 long chat: up to 34 turns in one new chat (session_turn_cap is 30 in runtime settings)
let lc = null, lastOk = 0, stopMsg = ''; for (let i = 1; i <= 34; i++) { const x = await ask(`QA P3 long chat message ${i}: reply with just the number ${i}.`, { page: { app: 'crm' }, ...(lc ? { conversation_id: lc } : {}) }); lc = x.final?.conversation_id || lc; if (x.error) { stopMsg = `turn ${i}: ${x.error}`; break; } lastOk = i; if (i >= 29) stopMsg += ` [${i}: ${tiaText(x).slice(0, 80)}]`; }
p3rec('F-05', '?', `turns answered=${lastOk}; ${stopMsg.slice(0, 600)}`, { conv: lc });
const sum = await ask('In one sentence, what was the first number I asked you to reply with in this chat?', { page: { app: 'crm' }, conversation_id: lc }); p3rec('F-05b', '?', `after the long chat: ${sum.error || ''} ${tiaText(sum).slice(0, 200)}`);
// F-09 titles
const titles = arr((await api('GET', `${C}?limit=15`)).j?.data).map(x => x.title).slice(0, 15); p3rec('F-09', '?', `latest chat titles: ${JSON.stringify(titles)}`);
// F-02 delete
const dl = await api('DELETE', `${C}/${lc}`); const g = await api('GET', `${C}/${lc}/messages?limit=5`); const still = arr((await api('GET', `${C}?limit=50`)).j?.data).some(x => x.id === conv);
p3rec('F-02', '?', `delete long chat=${dl.s}; its messages after=${g.s}; the other test chat still listed=${still}`);
const dl2 = await api('DELETE', `${C}/${conv}`); ledger('P3 F: test chats deleted ' + dl.s + '/' + dl2.s);
return 'ok';
