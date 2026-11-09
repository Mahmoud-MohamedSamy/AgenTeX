const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const enc = v => ({ kind: 'string', value: String(v) }); const out = {};
for (const [n, ph] of [['QA RT r8 AR api 1', '01012345691'], ['QA RT r8 control 1', '01012345692']]) { const r = await api('POST', `/modules/${L}/records`, { source: 'api', data: [['first_name', n], ['phone', ph], ['single_line_3_9', 'QA AEO']].map(([f, v]) => ({ field: f, value: enc(v) })) }); out[n] = r.s + ' ' + r.t.slice(0, 200); }
return done(out);
