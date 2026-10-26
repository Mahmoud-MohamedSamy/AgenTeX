const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', ID = '5712b381-59ee-4cb4-b025-b7a834d74d86';
await page.getByRole('button', { name: 'Pipeline', exact: true }).click(); await sleep(1500);
const dlg = await page.evaluate(() => { const d = document.querySelector('[role=dialog]'); return d ? d.innerText.slice(0, 500) : [...document.querySelectorAll('[role=option],[role=menuitem]')].map(e => e.innerText.trim()).join(' | '); });
await shot('1312-02-change-dialog');
return done({ dlg });
