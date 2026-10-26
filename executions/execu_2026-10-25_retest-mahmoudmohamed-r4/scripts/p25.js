// Is creating ANY deal with an explicit pipeline broken? API with Standard id; UI create with default Standard.
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', LS = 'fcba0068-d67f-44f5-8412-cdef9c09e16e', STD = '5170500c-b335-479c-96d1-ed138965c345';
const s = v => ({ kind: 'string', value: v }); const out = {};
const a = await api('POST', `/modules/${D}/records`, { layout_id: LS, data: [{ field: 'name', value: s('QA RT deal std') }, { field: 'deal_name', value: s('QA RT deal std') }, { field: 'pipeline', value: s(STD) }, { field: 'stage', value: s('qualification') }] });
out.apiStdId = a.s + ' ' + (a.j?.data?.id || a.j?.error?.details?.[0]?.message);
const b = await api('POST', `/modules/${D}/records`, { layout_id: LS, data: [{ field: 'name', value: s('QA RT deal stdname') }, { field: 'deal_name', value: s('QA RT deal stdname') }, { field: 'pipeline', value: s('Standard') }, { field: 'stage', value: s('qualification') }] });
out.apiStdName = b.s + ' ' + (b.j?.data?.id || b.j?.error?.details?.[0]?.message);
const f = arr((await api('GET', `/modules/${D}/fields`)).j?.data).find(x => x.apiName === 'pipeline'); out.fieldType = f?.datatypeKey + ' ' + JSON.stringify(f?.datatypeOptions || {}).slice(0, 200) + ' modified ' + f?.lastModifiedAt + ' by ' + f?.lastModifiedByName;
await page.goto(H + `/modules/${D}/records/new?layout=${LS}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Pipeline/.test(await txt().catch(() => ''))) break; } await sleep(1500);
await page.getByPlaceholder('Deal name').fill('QA RT deal ui std');
const resp = []; const fr = async r => { const q = r.request(); if (q.method() === 'POST' && /\/records$/.test(q.url().split('?')[0])) resp.push(r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 220)); }; page.on('response', fr);
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(5000); page.off('response', fr);
out.uiDefault = resp; await shot('deal-ui-default-save');
return done(out);
