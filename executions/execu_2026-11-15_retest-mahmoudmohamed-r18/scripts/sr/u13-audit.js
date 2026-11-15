const out = {};
await go('/settings/security/audit-log', 9000);
await page.getByText('All Entities', { exact: true }).first().click(); await sleep(1000);
const opt = page.getByText(/^Scoring Rule/).first(); out.opt = await opt.count();
if (out.opt) { await opt.click(); await sleep(800); await page.keyboard.press('Escape'); await sleep(3000); }
else { out.opts = (await page.locator('[role=option], [role=menuitemcheckbox], label').allInnerTexts()).filter(x => /scor/i.test(x)); }
const t = await bodyText(); out.lines = (t.match(/ndc-staging-owner updated QA RT18 SR F9 audit[^]{0,160}?IP/g) || []).slice(0, 4);
const el = page.getByText(/updated QA RT18 SR F9 audit/).first(); out.found = await el.count();
if (out.found) { await el.scrollIntoViewIfNeeded(); await sleep(500); out.box = await box(el); }
await shot('2945-2-audit-scoring.png');
if (out.found) { await el.click(); await sleep(2000); out.detail = (await bodyText()).match(/.{0,100}points.{0,300}/)?.[0]; await shot('2945-3-audit-detail.png'); }
return out;
