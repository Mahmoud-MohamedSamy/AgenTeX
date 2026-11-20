const B = JSON.parse(fs.readFileSync(RUN + '/out/baseline.json', 'utf8'));
return (B.perDept[IDS.DA].rr.data.rules || []).filter(r => r.is_active).map(r => ({ id: r.id, name: r.name, order: r.sort_order, exec: r.execute_on, t: r.targets.map(t => ({ c: JSON.stringify(t.criteria), m: t.method, pool: t.pool })) }));
