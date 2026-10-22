const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await sleep(4000);
const t = await page.locator('[role=dialog]').last().innerText();
const recs = arr((await api('GET', `/modules/${D}/records?page=1&per_page=200`)).j.data).filter(r => (r.data.find(x => x.field === 'pipeline') || {}).value?.value === '57aeb866-ba75-49d4-962b-fc9140d073ad');
return done({ t, dealsOnPipeline: recs.map(r => r.data.find(x => x.field === 'deal_name').value.value + ' / ' + r.data.find(x => x.field === 'stage').value.value) });
