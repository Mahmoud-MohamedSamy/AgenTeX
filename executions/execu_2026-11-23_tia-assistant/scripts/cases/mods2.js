const out = {};
for (const q of ['', '?app_key=desk', '?app=desk']) { const m = await api('GET', '/agents/modules' + q); out[q || 'none'] = arr(m.j?.data).map(x => x.app_key + ':' + x.module_key).join(' '); }
return out;
