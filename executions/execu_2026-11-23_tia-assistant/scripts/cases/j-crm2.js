const card = r => (r.final?.pending_actions || [])[0]; const out = {};
const j11 = JSON.parse(fs.readFileSync(RUN + '/out/j11-card.json', 'utf8'));
const x11 = await api('POST', `/agents/tia/actions/${j11.id}/confirm`, {}); out.J11 = { now: new Date().toISOString(), exp: j11.exp, s: x11.s, r: x11.j?.data?.status || x11.j?.error?.code, msg: x11.j?.data?.message || x11.j?.error?.message };
const j13 = await ask('Create a new contact: first name QA TIA, last name J13 Double, email qa.tia.j13@example.com.');
const c13 = card(j13); if (c13) { const [a, b] = await Promise.all([api('POST', `/agents/tia/actions/${c13.id}/confirm`, {}), api('POST', `/agents/tia/actions/${c13.id}/confirm`, {})]); out.J13 = [a.s + ' ' + (a.j?.data?.status || a.j?.error?.code), b.s + ' ' + (b.j?.data?.status || b.j?.error?.code)]; }
const j15 = await ask('Create a new deal with amount 500 and no name.'); const c15 = card(j15); out.J15 = { text: j15.text?.slice(0, 250), card: c15 && c15.lines };
if (c15) { const x = await api('POST', `/agents/tia/actions/${c15.id}/confirm`, {}); out.J15.confirm = x.s + ' ' + (x.j?.data?.status || '') + ' ' + (x.j?.data?.message || x.j?.error?.message || '').slice(0, 150); }
const j17 = await ask('Create a new service record named QA TIA J17 Service.'); const c17 = card(j17); out.J17 = { text: j17.text?.slice(0, 250), card: !!c17 };
if (c17) { const x = await api('POST', `/agents/tia/actions/${c17.id}/reject`, {}); out.J17.rej = x.s; }
const j23 = await ask('Add a private comment to the Desk ticket QA TIA T1 saying hello.'); out.J23 = { text: j23.text?.slice(0, 250), card: !!card(j23) };
if (card(j23)) await api('POST', `/agents/tia/actions/${card(j23).id}/reject`, {});
const j24 = await ask('Change the lead source of the leads QA TIA Lead 2 and QA TIA Lead 3 to other.'); out.J24 = { text: j24.text?.slice(0, 250), cards: (j24.final?.pending_actions || []).map(a => a.kind + ':' + a.target?.record_label + ':' + JSON.stringify(a.lines)) };
for (const a of (j24.final?.pending_actions || [])) await api('POST', `/agents/tia/actions/${a.id}/reject`, {});
fs.writeFileSync(RUN + '/out/j-crm2.json', JSON.stringify(out, null, 1));
return out;
