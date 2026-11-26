const tid = id => page.locator(`[data-testid="${id}"]`);
const R = {};
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(2500);
const cards = await page.$$eval('[data-testid$="-card"]', e => e.map(x => x.getAttribute('data-testid'))); R.cards = cards;
// N2-03 topics help text
const tc = cards.find(c => /topic/i.test(c)); R.n203 = tc ? (await tid(tc).innerText()).replace(/\n+/g, ' / ').slice(0, 600) : (await text()).split('\n').filter(l => /topic/i.test(l)).slice(0, 8);
await shot('N2-03-topics-card');
// N2-05 keyboard through the setup page
const stops = []; await page.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
for (let i = 0; i < 160; i++) { await page.keyboard.press('Tab'); const s = await page.evaluate(() => { const a = document.activeElement; if (!a) return ''; const c = a.closest('[data-testid$="-card"]'); return (c ? c.getAttribute('data-testid') : 'out') + '|' + a.tagName + '|' + (a.getAttribute('aria-label') || a.innerText || a.getAttribute('role') || '').trim().slice(0, 30); }); stops.push(s); }
const inCards = [...new Set(stops.map(s => s.split('|')[0]).filter(c => c !== 'out'))];
R.n205 = { cardsReached: inCards, cardsMissed: cards.filter(c => !inCards.includes(c)), sample: stops.filter(s => !s.startsWith('out')).slice(0, 25) };
// Edit dialog by keyboard
const editBtn = tid('tia-summary-card').locator('button', { hasText: 'Edit' }); await editBtn.focus(); await page.keyboard.press('Enter'); await sleep(2500);
const dlg = page.locator('[role=dialog]').last(); R.dialogOpen = await dlg.count();
const dstops = []; for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); dstops.push(await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))); }
R.n205.dialogFocusKept = dstops.every(Boolean); R.n205.dialogFocusLeftAt = dstops.indexOf(false);
// N2-02 B-09: Tools tab, run-action tool
const tabs = await dlg.locator('[role=tab], button').allInnerTexts(); R.tabs = tabs.map(t => t.trim()).filter(t => t && t.length < 30).slice(0, 20);
await dlg.locator('[role=tab], button', { hasText: /^Tools$/ }).first().click().catch(e => R.toolsErr = String(e).slice(0, 80)); await sleep(1500);
const dtext = (await dlg.innerText()).split('\n'); R.runActionLines = dtext.filter(l => /action/i.test(l)).slice(0, 12);
const ra = dlg.locator('label, [role=switch], [role=checkbox], div', { hasText: /run (an |custom )?action|Propose running/i }).last();
R.raCount = await ra.count();
const box = dlg.locator('input[type=checkbox], [role=switch], [role=checkbox]').filter({ has: page.locator('xpath=.') });
const cand = await dlg.locator('input[type=checkbox], [role=switch], [role=checkbox]').evaluateAll(els => els.map((e, i) => { let n = e, lab = ''; for (let k = 0; k < 4 && n; k++) { n = n.parentElement; if (n && n.innerText && n.innerText.length < 200) lab = n.innerText; } return { i, lab: lab.replace(/\s+/g, ' ').slice(0, 120), on: e.getAttribute('aria-checked') ?? String(e.checked), dis: e.disabled || e.getAttribute('aria-disabled') === 'true' }; }));
const t = cand.find(c => /run.*action|action.*run|custom action/i.test(c.lab)); R.raToggle = t;
if (t && t.on !== 'true' && !t.dis) { await dlg.locator('input[type=checkbox], [role=switch], [role=checkbox]').nth(t.i).click({ force: true }).catch(e => R.clickErr = String(e).slice(0, 80)); await sleep(1500); }
R.afterToggle = (await dlg.innerText()).split('\n').filter(l => /action|deploy|choose/i.test(l)).slice(0, 14);
await shot('N2-02-run-action-tool');
const saveBtn = dlg.locator('button', { hasText: /^(Save|Save draft|Save as draft)$/ }); R.saveDisabled = await saveBtn.first().isDisabled().catch(() => 'n/a');
// close without saving
await page.keyboard.press('Escape'); await sleep(1200);
const conf = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /Discard|Leave|Close without|Don.t save/i }); if (await conf.count()) { await conf.first().click(); await sleep(1200); }
R.dialogClosed = !(await page.locator('[role=dialog]').count());
if (!R.dialogClosed) { const c2 = page.locator('[role=dialog] button', { hasText: /^(Cancel|Close|Discard)$/ }); if (await c2.count()) { await c2.first().click(); await sleep(1500); } R.dialogClosed2 = !(await page.locator('[role=dialog]').count()); }
R.bannerUndeployed = (await text()).includes('not live yet');
return R;
