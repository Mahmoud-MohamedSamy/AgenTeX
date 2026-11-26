const tid = s => page.locator(`[data-testid="${s}"]`); const o = {};
await go('/approvals?list=requested&q=R16'); await sleep(4000);
const link = page.locator('[data-testid^="approval-ticket-link-"]').first(); o.links = await link.count();
if (await link.count()) { o.href = await link.getAttribute('href'); await page.goto(H + o.href, { waitUntil: 'commit', timeout: 120000 }).catch(e => o.navErr = String(e).slice(0, 80)); await page.getByText('QA PA T16').first().waitFor({ timeout: 120000 }).catch(() => o.waitErr = 'subject not shown'); await sleep(4000); o.url = page.url();
  o.pendingMarker = await page.locator('[data-testid*="approval-pending"]').count();
  o.markerText = ((await text()).match(/.{0,60}(Approval pending|Pending approval|Waiting for approval).{0,60}/i) || [null])[0];
  await shot('ui8-A-ticket');
  const tab = page.getByRole('tab', { name: /approval/i }).first(); o.approvalTab = await tab.count();
  if (!o.approvalTab) { const t2 = page.getByText(/^Approvals?$/).first(); o.approvalText = await t2.count(); if (await t2.count()) { await t2.click(); await sleep(3000); } } else { await tab.click(); await sleep(3000); }
  o.tabText = ((await text()).match(/(QA PA R16 request|Request approval)[\s\S]{0,700}/) || [''])[0].slice(0, 700);
  await shot('ui8-A-ticket-approvals');
  o.tabButtons = (await page.getByRole('button').allInnerTexts()).filter(t => /approv|remind|cancel|request/i.test(t)).slice(0, 15);
}
return o;
