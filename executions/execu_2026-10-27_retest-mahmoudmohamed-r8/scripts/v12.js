const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {}; const reqs = []; page.on('request', r => { if (['PATCH', 'POST'].includes(r.method()) && /records/.test(r.url())) reqs.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 300)); });
await go(`/modules/${D}`, 5000); for (let j = 0; j < 75 && !(await txt()).includes('QA RT r8 deal'); j++) await sleep(2000); await sleep(2000);
const row = page.getByText('QA RT r8 deal', { exact: true }).first(); const rb = await row.boundingBox();
const hdr = await page.getByText('Pipeline', { exact: true }).first().boundingBox(); out.cellAt = [hdr?.x, rb?.y];
await shot('v12-list-row');
const cellText = await page.evaluate(([x, y]) => { const el = document.elementFromPoint(x + 20, y + 8); return el ? el.closest('td,[role=gridcell],div')?.innerText : null; }, [hdr.x, rb.y]); out.cellText = cellText;
await page.mouse.click(hdr.x + 30, rb.y + 8); await sleep(2500); await shot('v12-inline-click');
out.afterClick = (await txt()).split('\n').filter(l => /pipeline|Pipeline|Stage|stage|Standard|^1$/.test(l)).slice(0, 15);
out.reqs = reqs; return done(out);
