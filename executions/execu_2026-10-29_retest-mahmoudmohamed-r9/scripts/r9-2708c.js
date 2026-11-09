const l = '4837e320-c472-4459-8e65-6db95a27712d'; const out = [];
for (let i = 0; i < 6; i++) { const a = await X.approvalState('o', T.LEADS, l); const r = await api('o', 'GET', `/modules/${T.LEADS}/records/${l}`); out.push(a.s + ' ' + (a.j?.data?.state || a.t.slice(0, 120)) + ' | record ' + r.s); await sleep(2000); }
return out;
