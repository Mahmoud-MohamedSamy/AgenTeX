// Audit trail: change through Tia vs manual. Cleans up.
const o = {}; const L = M.leads; const val = v => ({ kind: 'string', value: v }); const t0 = new Date(Date.now() - 5000).toISOString();
const tag = Math.random().toString(36).slice(2, 6).toUpperCase();
const confirmAll = async r => { const out = []; for (const a of r.final?.pending_actions || []) { const c = await api('POST', `/agents/tia/actions/${a.id}/confirm`, {}); out.push(a.kind + ':' + (c.j?.data?.status || c.s)); } if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); return out; };
const m = await api('POST', `/modules/${L}/records`, { data: [{ field: 'first_name', value: val('QA TIA AUD manual ' + tag) }, { field: 'name', value: val('QA TIA AUD manual ' + tag) }] }); o.manualId = m.j?.data?.id || m.j?.data?.[0]?.id;
const r1 = await ask(`Create a lead with first name "QA TIA AUD tia ${tag}" and last name "Audit". Prepare the card for me to confirm.`, { page: { app: 'crm' } }); o.tiaLeadConfirm = await confirmAll(r1);
const r2 = await ask('Create a workflow rule on Leads that creates a follow-up task when a lead is created with lead source Web. Prepare the card for me to confirm.', { page: { app: 'crm' } }); o.tiaRuleConfirm = await confirmAll(r2);
await sleep(15000);
const ev = await api('GET', `/audit/events?limit=100&from=${encodeURIComponent(t0)}`); const list = arr(ev.j?.data?.items || ev.j?.data);
o.eventsStatus = ev.s; o.keys = Object.keys(list[0] || {});
o.events = list.filter(e => String(e.created_at || e.occurred_at || '') >= t0 || true).slice(0, 25).map(e => ({ action: e.action || e.event_type, target: e.target_type, label: String(e.target_label || '').slice(0, 40), actor: e.actor_label || e.actor_id?.slice?.(0, 8), actorType: e.actor_type, via: e.via || e.source || e.channel || e.metadata?.source || e.context?.source || null, meta: JSON.stringify(e.metadata || e.details || e.context || null).slice(0, 120) }));
// cleanup
const find = async v => arr((await api('GET', `/modules/${L}/records?page=1&per_page=20&filters=${encodeURIComponent(JSON.stringify([{ field: 'first_name', operator: 'starts_with', value: v }]))}`)).j?.data).map(x => x.id);
o.cleanup = { leads: [] }; for (const id of [...await find('QA TIA AUD')]) o.cleanup.leads.push((await api('DELETE', `/modules/${L}/records/${id}`)).s);
const rules = arr((await api('GET', '/workflow/rules?limit=300')).j?.data).filter(r => String(r.createdAt || r.created_at || '') >= t0); o.cleanup.rules = []; for (const r of rules) o.cleanup.rules.push(r.name + ':' + (await api('DELETE', `/workflow/rules/${r.id}`)).s);
ledger('P7 audit test cleanup ' + JSON.stringify(o.cleanup));
fs.appendFileSync(RUN + '/out/p7-results.jsonl', JSON.stringify({ part: 'audit', at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
