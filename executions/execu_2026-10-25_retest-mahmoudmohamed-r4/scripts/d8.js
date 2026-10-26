const ID = '01727195-e2d5-41c5-821b-a30d5a965976', DIR = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-25_retest-mahmoudmohamed-r4/files/';
await page.goto(H + `/modules/${ID}/records/new`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT file/.test(await txt().catch(() => ''))) break; } await sleep(2000);
const inputs = await page.locator('input[type=file]').count();
const out = { url: page.url().replace(H, ''), inputs };
const fileInput = page.locator('input[type=file]').filter({ has: page.locator('xx') });
const all = page.locator('input[type=file]');
const meta = await all.evaluateAll(es => es.map(e => ({ accept: e.accept, near: (e.closest('div[class*=grid],div[class*=row],label,div')?.parentElement?.innerText || '').slice(0, 40) })));
out.meta = meta;
for (const [k, f] of [['txt', 'qa-rt.txt'], ['big', 'qa-rt-big.pdf']]) {
  await all.first().setInputFiles(DIR + f); await sleep(2500);
  out[k] = { msgs: (await txt()).split('\n').filter(l => /allowed|not allowed|exceed|too large|maximum|only|type/i.test(l)).slice(0, 4), toasts: await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim())) };
  await shot('2233-0' + (k === 'txt' ? 1 : 2) + '-' + k);
}
return done(out);
