const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const snip = (t, k, n) => { const i = t.indexOf(k); return i < 0 ? '(not found)' : t.slice(i, i + (n || 700)).replace(/\s+/g, ' '); };
await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket/, 30);
// AI assist
const ai = page.getByRole('button', { name: 'AI assist' }).first(); if (await ai.count()) { await ai.click().catch(() => {}); await sleep(5000); const t = await txt(); o.aiPane = snip(t, 'AI assist', 900);
  const run = page.getByRole('button', { name: /Summar|Run|Generate/i }).first(); if (await run.count()) { await run.click().catch(() => {}); await sleep(8000); o.aiAfterRun = snip(await txt(), 'AI assist', 900); }
  o.shotAi = await shot('../wave2/ui-ai-assist'); await page.keyboard.press('Escape'); }
// History
const hist = page.getByRole('tab', { name: /history/i }).first(); if (await hist.count()) { await hist.click().catch(() => {}); await sleep(5000); const th = await txt(); o.history = snip(th, 'Created', 1400); o.histRawUuid = (th.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g) || []).slice(0, 3); o.histHasDeptId = /department_id/.test(th); o.shotHist = await shot('../wave2/ui-history'); }
// Reply composer + Articles
const rep = page.getByRole('button', { name: /^Reply$/ }).first(); if (await rep.count()) { await rep.click().catch(() => {}); await sleep(4000);
  const art = page.getByRole('button', { name: /Articles/ }).first(); o.articlesBtn = await art.count(); if (o.articlesBtn) { await art.click().catch(() => {}); await sleep(6000); o.articles = snip(await txt(), 'Suggested articles', 500); o.shotArt = await shot('../wave2/ui-kb-suggest'); }
  o.composerTools = (await page.$$eval('[role=toolbar] button, [aria-label]', bs => bs.filter(b => b.offsetParent !== null).map(b => b.getAttribute('aria-label')).filter(Boolean))).filter(x => /bold|italic|link|image|snippet|template|attach|signature|insert|emoji|table|list|translate|ai/i.test(x)).slice(0, 30);
  await page.keyboard.press('Escape'); const disc = page.getByRole('button', { name: /Discard|Cancel/ }).first(); if (await disc.count()) await disc.click().catch(() => {}); }
// Print
const more = page.locator('button[aria-label="More ticket actions"]').first(); if (await more.count()) { await more.click().catch(() => {}); await sleep(1200); const pr = page.getByRole('menuitem', { name: 'Print' }).first(); if (await pr.count()) { await pr.click().catch(() => {}); await sleep(5000); o.print = snip(await txt(), 'Print ticket', 600); await page.keyboard.press('Escape'); } }
return done(o);
