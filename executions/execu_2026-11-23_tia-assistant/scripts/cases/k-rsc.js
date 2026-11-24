const M = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const vis = {}; for (const k of ['QA TIA Lead 1', 'QA TIA Lead 2', 'QA TIA Lead 3']) vis[k] = (await api('GET', `/modules/${M}/records/${CRMIDS[k]}`)).s;
const out = {};
out.K01 = short(await ask('Show me the details of the lead QA TIA Lead 1, including its email.'));
out.K02 = short(await ask('How many leads have a name starting with QA TIA?'));
const j16 = await ask('Change the lead source of the lead QA TIA Lead 1 to chat.');
out.J16 = { ...short(j16) };
for (const a of (j16.final?.pending_actions || [])) { const x = await api('POST', `/agents/tia/actions/${a.id}/confirm`, {}); out.J16.confirm = x.s + ' ' + (x.j?.data?.status || x.j?.error?.code) + ' ' + (x.j?.data?.message || '').slice(0, 120); }
fs.writeFileSync(RUN + '/out/k-rsc.json', JSON.stringify({ vis, out }, null, 1));
return { vis, out: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.text.slice(0, 300) + ` (refs ${v.refs}, actions ${v.actions.length}${v.confirm ? ', confirm ' + v.confirm : ''})`])) };
