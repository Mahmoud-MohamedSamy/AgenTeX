// Close the open Zoho composer with Cancel (discard), then confirm no draft exists on #101
const c = page.locator('button, span').filter({ hasText: /^\s*Cancel\s*$/ }); out.cancelCount = await c.count();
if (out.cancelCount) { await c.last().click().catch(() => {}); await sleep(2000); const d = page.locator('button, span').filter({ hasText: /^\s*(Discard|Yes|Yes, discard)\s*$/i }); out.discardCount = await d.count(); if (out.discardCount) await d.first().click().catch(() => {}); await sleep(2000); }
out.after = (await txt()).match(/Draft[^\n]{0,80}/g) || 'no draft text';
