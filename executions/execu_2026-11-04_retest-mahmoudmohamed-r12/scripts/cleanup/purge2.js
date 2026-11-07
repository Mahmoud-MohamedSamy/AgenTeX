const bin = arr((await api('o', 'GET', 'desk:/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).filter(x => /^QA RT1[12] /.test(x.record_label || ''));
const r = await api('o', 'POST', 'desk:/audit/recycle-bin/delete', { ids: bin.map(x => x.id) });
const left = arr((await api('o', 'GET', 'desk:/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).filter(x => /^QA RT/.test(x.record_label || '')).length;
return { purged: bin.length, s: r.s, left };
