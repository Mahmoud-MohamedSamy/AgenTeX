// NDC-1302 UI: Create Deal → pipeline picker options, pick "1", stage, save.
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', LS = 'fcba0068-d67f-44f5-8412-cdef9c09e16e';
await page.goto(H + `/modules/${D}/records/new?layout=${LS}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Pipeline/.test(await txt().catch(() => ''))) break; }
await sleep(2000); await shot('1302-01-create-form');
const ctrls = await page.evaluate(() => [...document.querySelectorAll('button[aria-label], [role=combobox], select, input')].map(e => (e.getAttribute('aria-label') || e.placeholder || e.name || '') + ' | ' + (e.innerText || e.value || '').trim().slice(0, 40)).filter(s => /pipeline|stage|deal name|name/i.test(s)).slice(0, 15));
return done({ ctrls, text: ((await txt()).match(/Pipeline[\s\S]{0,200}/) || [''])[0] });
