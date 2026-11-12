const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.t.slice(0, 160));
const fails = []; const onF = r => { if (r.status() >= 400 || /s3\/anyware-files/.test(r.url())) fails.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(/\?.*$/, '?…').slice(-90)); }; page.on('response', onF);
const ce = []; const onC = m => { if (m.type() === 'error') ce.push(m.text().slice(0, 200)); }; page.on('console', onC);
await go('/knowledge-base/gallery', 15000);
const n0 = NET.length;
await page.locator('main input[type=file]').first().setInputFiles(RUN + '/evidence/raw/w4/W4-49-portal-ar.png');
for (let i = 0; i < 12; i++) { await sleep(2500); const t = (await page.locator('main').last().innerText()).replace(/\s+/g, ' '); if (!/Uploading/.test(t)) break; }
out.after = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 300); out.net = nn(n0); out.fails = fails.slice(0, 8); out.console = ce.slice(0, 6);
await shot('w4/W4-66-gallery-upload');
page.off('response', onF); page.off('console', onC);
return fin({ out });
