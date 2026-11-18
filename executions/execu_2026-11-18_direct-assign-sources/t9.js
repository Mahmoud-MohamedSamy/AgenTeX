const r = await api('GET', '/web-forms?app=desk'); const L = arr(r.j);
for (const f of L) log({ id: f.id, name: f.name, kind: f.kind || f.type, dept: f.department_id || f.settings?.department_id, status: f.status, slug: f.slug || f.public_id || f.key, review: JSON.stringify(f.review || f.settings?.review || '').slice(0, 120), keys: Object.keys(f).join(',') });
