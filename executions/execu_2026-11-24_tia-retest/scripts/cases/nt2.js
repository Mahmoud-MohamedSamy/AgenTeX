const S = JSON.parse(fs.readFileSync(RUN + '/out/nt.json', 'utf8')); const L = M.leads; const MAH = '3445ec4a-020e-4f12-b156-dd2de7610164'; const o = {};
const r = await ask(`Change the owner of the lead "QA TIA NT viaTia" (record id ${S.b}) to the user with id ${MAH}. Prepare the card.`, { page: { app: 'crm', route: `/modules/${L}/records/${S.b}`, module_id: L, record_id: S.b } });
o.text = (r.text || r.final?.text || '').slice(0, 200); o.cards = (r.final?.pending_actions || []).map(a => a.kind + ': ' + (a.summary || '').slice(0, 150));
for (const a of r.final?.pending_actions || []) { const c = await api('POST', `/agents/tia/actions/${a.id}/confirm`, {}); o.confirm = c.s + ' ' + (c.t || '').slice(0, 250); }
if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`);
await sleep(15000); o.ownerB = arr((await api('GET', `/modules/${L}/records/${S.b}`)).j?.data?.data).find(x => x.field === 'owner')?.value?.value === MAH; return o;
