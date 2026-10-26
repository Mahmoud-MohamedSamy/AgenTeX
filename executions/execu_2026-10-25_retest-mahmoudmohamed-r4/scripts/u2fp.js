const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const s = v => ({ kind: 'string', value: v }); const out = {};
const me = await api('GET', '/iam/me'); out.me = JSON.stringify(me.j?.data?.profiles || me.j?.data?.profile || me.j?.data?.profileIds || Object.keys(me.j?.data || {})).slice(0, 300);
const fl = arr((await api('GET', `/modules/${L}/fields`)).j?.data).find(x => x.fieldName === 'qa_rt_fp'); out.fieldVisibleToU2 = !!fl;
const w = await api('POST', `/modules/${L}/records`, { layout_id: LT, data: [{ field: 'first_name', value: s('QA RT 1337 u2') }, { field: 'qa_rt_fp', value: s('secret') }] });
out.writeHidden = w.s + ' ' + (w.j?.error?.code || '') + ' ' + (w.j?.error?.details?.[0]?.message || w.j?.data?.id || '');
const w2 = await api('POST', `/modules/${L}/records`, { layout_id: LT, data: [{ field: 'first_name', value: s('QA RT 1337 u2 plain') }] });
out.writePlain = w2.s + ' ' + (w2.j?.data?.id || w2.j?.error?.details?.[0]?.message || '');
return out;
