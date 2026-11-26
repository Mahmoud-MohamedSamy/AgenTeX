const enc = v => ({ kind: 'string', value: String(v) });
const r = await api('POST', `/modules/${M.leads}/records`, { data: Object.entries({ name: 'QA TIA K03 Lead', first_name: 'QA TIA', last_name: 'K03 Lead', company: 'QA K03 Co', single_line: 'QA-TIA-SECRET-K03', single_line_3_9: 'QA', owner: '3445ec4a-020e-4f12-b156-dd2de7610164' }).map(([field, v]) => ({ field, value: enc(v) })) });
const id = r.j?.data?.id; if (id) ledger('K-03: CRM lead "QA TIA K03 Lead" ' + id + ' owner=RSC, single_line=QA-TIA-SECRET-K03 — delete after');
const all = ids(); all.k03 = id; fs.writeFileSync(RUN + '/out/ids.json', JSON.stringify(all, null, 1));
return { s: r.s, id, err: id ? null : (r.t || '').slice(0, 300) };
