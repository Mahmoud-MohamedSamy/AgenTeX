const mid = await modId(); const s = await api('GET', '/modules/' + mid + '/import/' + I.imp); const out = { d: JSON.stringify(s.j.data).slice(0, 1200) };
for (const p of ['/errors', '/results', '/rows?status=failed', '/issues?page=1&size=20']) { const x = await api('GET', '/modules/' + mid + '/import/' + I.imp + p); out[p] = x.s + ' ' + x.t.slice(0, 500); }
const recs = await api('GET', '/modules/' + mid + '/records?limit=5&q=' + encodeURIComponent('QA VR1112 imp')); out.recs = arr(recs.j.data).map(r => (r.data || []).filter(x => /first_name|qa_vr_text/.test(x.field)).map(x => x.value.value).join('/'));
return out;
