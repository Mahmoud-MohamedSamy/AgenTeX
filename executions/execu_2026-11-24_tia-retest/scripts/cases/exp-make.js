const r = await ask('Create a lead with first name "QA TIA EXP card" and last name "Expired". Prepare the card for me to confirm.', { page: { app: 'crm' } });
const a = (r.final?.pending_actions || [])[0]; const o = { conv: r.final?.conversation_id, action: a?.id, kind: a?.kind, expires: a?.expires_at, made: new Date().toISOString(), text: (r.text || r.final?.text || '').slice(0, 120) };
fs.writeFileSync(RUN + '/out/exp-card.json', JSON.stringify(o, null, 1)); ledger('P7 expiry card made ' + JSON.stringify({ conv: o.conv, exp: o.expires })); return o;
