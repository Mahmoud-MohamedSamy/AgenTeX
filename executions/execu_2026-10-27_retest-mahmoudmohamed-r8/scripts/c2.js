const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const c = await api('GET', `/modules/${L}/conversion/config`); const t = await api('GET', `/modules/${L}/conversion/targets`);
const grab = (s, w) => { const i = s.indexOf(w); return i < 0 ? 'absent' : s.slice(Math.max(0, i - 300), i + 300); };
return done({ cfg: grab(c.t.length > 590 ? JSON.stringify(c.j) : c.t, 'partners'), tgt: grab(JSON.stringify(t.j), 'QA RT partners'), cfgKeys: Object.keys(c.j?.data || {}) });
