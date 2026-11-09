const r = await call('GET', '/iam/integrations/clients'); return { s: r.s, qa: JSON.stringify((r.j && r.j.data) || r.t).match(/QA[^"]{0,40}/g) };
