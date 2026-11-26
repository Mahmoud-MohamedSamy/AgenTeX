const T = M.tickets; const list = arr((await api('GET', `/modules/${T}/records?page=1&per_page=20`)).j?.data); const fv = (r, k) => arr(r.data).find(x => x.field === k)?.value?.value;
const o = { ctx: [] };
for (const t of list.filter(x => fv(x, 'subject') && !/^QA/.test(fv(x, 'subject'))).slice(0, 3)) {
  const subj = String(fv(t, 'subject')); const pg = { app: 'desk', route: `/views/all/tickets/${t.id}`, module_id: T, record_id: t.id };
  const r = await ask('Summarise this ticket: subject, status and who it is assigned to.', { page: pg }); const tx = r.text || r.final?.text || ''; if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`);
  o.ctx.push({ subject: subj.slice(0, 40), right: tx.toLowerCase().includes(subj.toLowerCase().slice(0, 12)), text: tx.slice(0, 180) }); await sleep(2500);
}
const l = await ask('How many records are in this list?', { page: { app: 'desk', route: '/views/all/tickets', module_id: T } }); o.thisList = (l.text || l.final?.text || '').slice(0, 160); if (l.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${l.final.conversation_id}`);
return o;
