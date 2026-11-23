const out = {};
const r6 = await ask('Create a new lead: first name QA TIA, last name E06 Lead, company QA Co.');
const r6b = await ask('Create a new contact: first name QA TIA, last name E06 Contact, email qa.tia.e06@example.com.');
const r7 = await ask('Create a workflow rule on Leads: when a lead is created with lead source web, add the tag QA TIA WF. Name it QA TIA E07 rule.');
const r8 = await ask('Create a blueprint for the Deals module named QA TIA E08 blueprint with stages Qualification then Proposal.');
fs.writeFileSync(RUN + '/out/e-cra.json', JSON.stringify({ r6, r6b, r7, r8 }, null, 1));
const rej = [];
for (const r of [r6, r6b, r7, r8]) for (const a of (r.final?.pending_actions || [])) { const x = await api('POST', `/agents/tia/actions/${a.id}/reject`, {}); rej.push(a.kind + ':' + x.s); }
return { r6: short(r6), r6b: short(r6b), r7: short(r7), r8: short(r8), rejected: rej, pa0: JSON.stringify((r6b.final?.pending_actions || [])[0] || {}).slice(0, 700) };
