const mid = await modId(); const out = {};
for (const q of ['?layoutId=' + I.layout, '?departmentId=7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', '?status=active', '?limit=1']) { const r = await api('GET', VR(mid) + q); out[q.split('=')[0]] = r.s + ' n=' + arr(r.j && r.j.data).length; }
out.all = (await rules(mid)).length; return out;
