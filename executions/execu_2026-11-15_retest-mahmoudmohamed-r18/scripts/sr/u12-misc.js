const out = {};
await go('/settings/automation/scoring-rules?module=00000000-0000-0000-0000-000000000009', 9000);
const main = page.locator('main'); out.b10 = (await main.innerText().catch(() => bodyText())).replace(/\s+/g, ' ').slice(-500);
out.b10New = await page.getByRole('button', { name: /New Scoring Rule/ }).count(); out.b10NewEnabled = out.b10New ? await page.getByRole('button', { name: /New Scoring Rule/ }).first().isEnabled() : null;
await shot('2943-1-unknown-module.png');
// audit log
await go('/settings/audit-log', 9000);
out.auditUrl = page.url();
const s = page.getByPlaceholder(/Search/i).last(); if (await s.count()) { await s.fill('QA RT18 SR F9 audit'); await sleep(3000); }
out.auditRows = (await page.locator('tbody tr').allInnerTexts().catch(() => [])).slice(0, 6).map(x => x.replace(/\s+/g, ' ').slice(0, 200));
await shot('2945-1-audit-list.png');
const row = page.locator('tbody tr').filter({ hasText: /QA RT18 SR F9 audit/ }).filter({ hasText: /[Uu]pdated/ });
out.updRows = await row.count();
return out;
