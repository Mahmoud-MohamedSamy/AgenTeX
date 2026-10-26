const DIR = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-25_retest-mahmoudmohamed-r4/files/';
await page.reload({ waitUntil: 'commit' }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/QA RT file/.test(await txt().catch(() => ''))) break; } await sleep(2000);
const all = page.locator('input[type=file]'); const out = {};
const sect = async () => (await txt()).split('QA RT file')[1]?.split('\n').filter(Boolean).slice(0, 8).join(' | ');
for (const [k, idx, f] of [['file_txt', 1, 'qa-rt.txt'], ['file_big', 1, 'qa-rt-big.pdf'], ['img_txt', 2, 'qa-rt.txt'], ['file_ok', 1, 'qa-rt-ok.pdf']]) {
  await all.nth(idx).setInputFiles(DIR + f); await sleep(3000);
  out[k] = { section: await sect(), toasts: await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim())), alerts: await page.evaluate(() => [...document.querySelectorAll('[role=alert]')].map(t => t.innerText.trim()).filter(Boolean)) };
  await shot('2233-' + k);
}
return done(out);
