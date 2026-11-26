const r = await api('GET', '/desk/approvals'); const d = r.j.data;
return { keys: Object.keys(d), meta: r.j.meta, n: (d.approvals||[]).length, other: Object.fromEntries(Object.entries(d).filter(([k]) => k !== 'approvals')) };
