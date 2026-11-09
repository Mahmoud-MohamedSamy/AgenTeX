const M2 = 'bb375218-6a5d-48ec-a832-fb062fd0311b', L = '3a58c8a9-a334-4607-b4b3-c5129751f3ab';
const r = await call('GET', `/modules/${M2}/layouts/${L}`); const s = JSON.stringify(r.j.data);
return { s: r.s, hasAmount: /qa_w5_amount/.test(s), rowVersion: r.j.data.rowVersion, modified: r.j.data.lastModifiedAt || r.j.data.updatedAt };
