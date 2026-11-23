const M = made.mod, LID = made.layouts[0];
const csv = 'Name,QA Num,QA FX UI Double\nQA FX H6 a,3,999\nQA FX H6 b,12,\nQA FX H6 c,,5\n';
const fd = new FormData(); fd.append('file', new Blob([csv], { type: 'text/csv' }), 'qa-fx-h6.csv');
const up = await api('POST', `/modules/${M}/import`, fd, { form: true }); log('upload', E(up), JSON.stringify(up.j?.data).slice(0, 600));
const sid = up.j?.data?.id || up.j?.data?.session_id || up.j?.data?.sessionId; if (!sid) return;
made.importSession = sid; keep();
const f = await api('GET', `/modules/${M}/import/${sid}/fields?layout_id=${LID}`); log('fields', E(f), JSON.stringify(f.j?.data).slice(0, 1200));
