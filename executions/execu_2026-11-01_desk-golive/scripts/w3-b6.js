const A = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca';
const g = await api('GET', '/workflow/custom-actions/' + A); out.get = g.s; const a = D(g.j); out.keys = Object.keys(a || {}); out.timeout = a && (a.timeoutSeconds ?? a.timeout ?? a.timeout_seconds);
return fin({ out: { ...out, sample: JSON.stringify(a).slice(0, 2500) } });
