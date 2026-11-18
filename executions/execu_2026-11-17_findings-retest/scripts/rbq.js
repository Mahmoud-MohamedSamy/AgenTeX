const q = async (qs) => { const r = await api('GET', '/audit/recycle-bin/items?' + qs); const it = arr(r.j); return { s: r.s, n: it.length, labels: it.slice(0, 6).map(x => x.record_label || x.label || x.name) }; };
log({ crm_qa_rt21: await q('app_key=crm&q=QA%20RT21%20SC&limit=50') });
log({ crm_nonsense: await q('app_key=crm&q=zzqq-no-such-record-777&limit=50') });
log({ crm_no_q: await q('app_key=crm&limit=50') });
log({ desk_nonsense: await q('app_key=desk&q=zzqq-no-such-record-777&limit=50') });
