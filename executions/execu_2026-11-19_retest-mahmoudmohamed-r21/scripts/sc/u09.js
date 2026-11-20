const out = {};
await go('/settings/security/audit-log', 9000);
await page.getByText('All Entities', { exact: true }).first().click().catch(() => {}); await sleep(1000);
const opt = page.getByText(/^Scoring Rule/).first(); out.opt = await opt.count();
if (out.opt) { await opt.click(); await sleep(800); await page.keyboard.press('Escape'); await sleep(3500); }
const t = await bodyText(); out.lines = (t.match(/ndc-staging-owner (created|updated|deleted) QA RT20 SC[^]{0,140}?(IP|ago|AM|PM)/g) || []).slice(0, 12);
const el = page.getByText(/updated QA RT20 SC R1 fit/).first(); out.found = await el.count();
if (out.found) { await el.scrollIntoViewIfNeeded(); await sleep(500); }
await shot('1483-20-audit.png');
if (out.found) { await el.click(); await sleep(2000); out.detail = ((await bodyText()).match(/.{0,100}points.{0,300}/) || [''])[0]; await shot('1483-21-audit-detail.png'); }
return out;
