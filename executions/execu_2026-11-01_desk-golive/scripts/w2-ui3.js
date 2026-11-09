const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const snip = (t, k, n) => { const i = t.indexOf(k); return i < 0 ? '(not found: ' + k + ')' : t.slice(i, i + (n || 700)).replace(/\s+/g, ' '); };
await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket/, 30);
// AI assist via aria-label
const ai = page.locator('[aria-label="AI assist"]').first(); o.aiCount = await ai.count(); if (o.aiCount) { await ai.click().catch(() => {}); await sleep(6000); const t = await txt(); o.aiPane = snip(t, 'AI assist', 900);
  const btns = await page.$$eval('button', bs => bs.filter(b => b.offsetParent !== null).map(b => b.innerText.trim()).filter(x => /summar|triage|suggest|run|generate/i.test(x))); o.aiButtons = btns.slice(0, 10);
  const run = page.locator('button', { hasText: /Summar/i }).first(); if (await run.count()) { await run.click().catch(() => {}); await sleep(10000); o.aiAfterRun = snip(await txt(), 'AI assist', 1000); }
  o.shotAi = await shot('wave2/ui-ai-assist'); }
// History creation row
const hist = page.getByRole('tab', { name: /history/i }).first(); if (await hist.count()) { await hist.click().catch(() => {}); await sleep(4000);
  for (let i = 0; i < 12; i++) { await page.mouse.move(960, 500); await page.mouse.wheel(0, 3000); await sleep(800); }
  const th = await txt(); const k = th.lastIndexOf('created'); o.histTail = th.slice(Math.max(0, th.length - 1500)).replace(/\s+/g, ' '); o.histDeptRaw = /department_id|9a7e391c-be72/.test(th); o.shotHistEnd = await shot('wave2/ui-history-end'); }
// Shift+C
await page.locator('h1, [aria-label="Edit the subject"]').first().click({ trial: true }).catch(() => {}); await page.keyboard.press('Escape'); await page.keyboard.press('Shift+C'); await sleep(2500); o.editorsAfterShiftC = await page.$$eval('[contenteditable=true]', e => e.filter(x => x.offsetParent !== null).length); o.shiftCText = snip(await txt(), 'Comment', 200);
await page.keyboard.press('Escape');
return done(o);
