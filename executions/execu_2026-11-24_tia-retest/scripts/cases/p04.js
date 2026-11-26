const enc = v => typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) };
const mk = async (mod, label, vals) => { const r = await api('POST', `/modules/${M[mod]}/records`, { data: Object.entries(vals).map(([field, v]) => ({ field, value: enc(v) })) }); const id = r.j?.data?.id; if (id) ledger(`CRM ${mod} "${label}" ${id}`); return { s: r.s, id, err: id ? undefined : (r.t || '').slice(0, 300) }; };
const lead = await mk('leads', 'QA TIA RT Lead', { name: 'QA TIA RT Lead', first_name: 'QA TIA RT', last_name: 'Lead', company: 'QA TIA RT Co', email: 'qa.tia.rt.lead@example.com', lead_source: 'web', single_line_3_9: 'QA' });
const d = new Date(); const close = new Date(d.getFullYear(), d.getMonth(), 28).toISOString().slice(0, 10);
const deal = await mk('deals', 'QA TIA RT Deal 1500', { name: 'QA TIA RT Deal 1500', deal_name: 'QA TIA RT Deal 1500', amount: 1500, stage: 'qualification', closing_date: close });
const all = ids(); all.lead = lead.id; all.deal = deal.id; fs.writeFileSync(RUN + '/out/ids.json', JSON.stringify(all, null, 1));
return { lead, deal };
