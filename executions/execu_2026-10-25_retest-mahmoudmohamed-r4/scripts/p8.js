// NDC-1312: deal detail → Change pipeline → choose "1" + stage → confirm.
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', ID = '5712b381-59ee-4cb4-b025-b7a834d74d86';
await page.goto(H + `/modules/${D}/records/${ID}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/QA RT 1302 move/.test(await txt().catch(() => ''))) break; } await sleep(2000);
const btns = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(t => /pipeline|stage|more|action/i.test(t)).slice(0, 15));
await shot('1312-01-deal');
return done({ btns, head: (await txt()).slice(0, 600) });
