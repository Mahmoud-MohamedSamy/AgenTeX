const r = await api('GET', '/scoring-rules/run?module_id=841043e1-c078-41f9-8d6e-dfd61bee45c3'); return [r.s, r.t.slice(0, 700), new Date().toISOString()];
