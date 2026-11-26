const tid = s => page.locator(`[data-testid="${s}"]`); const o = {};
await go('/approvals?list=requested'); await sleep(4000);
o.requestedTop = (await tid('approvals-page').innerText().catch(() => '')).slice(0, 900);
await shot('ui7-A-requested');
// ticket T16 page
await go('/tickets/928e975c-f055-4264-b1cf-a0e389d15d2b'); await sleep(6000);
o.ticketUrl = page.url();
o.pendingMarker = await page.locator('[data-testid*="approval-pending"]').count();
o.ticketHeadText = ((await text()).match(/.{0,80}(Approval pending|Waiting for approval|pending approval).{0,80}/i) || [null])[0];
const tab = page.getByRole('tab', { name: /approval/i }).first(); o.approvalTab = await tab.count();
if (await tab.count()) { await tab.click(); await sleep(3000); o.approvalTabText = ((await text()).match(/Approval[\s\S]{0,900}/) || [''])[0].slice(0, 900); }
await shot('ui7-A-ticket-approval-tab');
// tickets list marker
await go('/tickets'); await sleep(6000);
o.listMarkers = await page.locator('[data-testid*="approval-pending"]').count();
o.listHasApprovalColumn = /Approval/i.test(await page.locator('table thead, [role=columnheader]').first().innerText().catch(() => ''));
return o;
