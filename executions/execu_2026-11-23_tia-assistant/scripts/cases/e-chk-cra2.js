const r7 = await ask('Create a workflow rule named QA TIA E07 rule on Leads: when a lead is created, create a task "Call the lead" for the lead owner.');
const r8 = await ask('Please propose a new blueprint for Deals called QA TIA E08 blueprint. Use the blueprint tool.');
fs.writeFileSync(RUN + '/out/e-cra2.json', JSON.stringify({ r7, r8 }, null, 1));
const keep = {};
for (const [k, r] of Object.entries({ r7, r8 })) for (const a of (r.final?.pending_actions || [])) { keep[k] = a; }
return { r7: short(r7), r8: short(r8), p7: JSON.stringify(keep.r7 || {}).slice(0, 900), p8: JSON.stringify(keep.r8 || {}).slice(0, 900) };
