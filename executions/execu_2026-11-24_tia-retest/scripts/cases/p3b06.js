const x = await askCard('Change the lead source of the lead "QA-P3-X" to Referral.'); if (!x.acts[0]) return 'no card: ' + x.text.slice(0, 200);
let st = 0, t0 = Date.now(); for (let i = 0; i < 20; i++) { const s = await api('GET', '/agents/tia/status?app=crm'); st = s.s; if (st === 403) break; await sleep(30000); }
const c = await confirmA(x.acts[0]); const g = await getRec(M.leads, P3I.leadB);
p3rec('B-06', '?', `card made while allowed; Tia status became ${st} after ${Math.round((Date.now() - t0) / 1000)} s; confirm then=${JSON.stringify(c)}; lead source now=${val(g.rec, 'lead_source')}`, { conv: x.conv });
return { st, c, src: val(g.rec, 'lead_source') };
