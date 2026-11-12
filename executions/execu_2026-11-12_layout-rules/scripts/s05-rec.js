const mid = await modId();
const ids = ['c85f180d-6bd0-493f-b510-d368941de29a', '8e9221d0-6743-40f8-a81f-6916dbf23110'];
const out = {};
for (const id of ids) { (I.recs = I.recs || []).push([mid, id]); const g = (await api('GET', '/modules/' + mid + '/records/' + id)).j; const d = (g?.data?.data) || []; const o = {}; for (const x of d) if (/qa_lr_|first_name/.test(x.field)) o[x.field] = x.value?.value ?? x.value?.items ?? x.value?.kind; out[id.slice(0, 8)] = o; }
SAVE(); return out;
