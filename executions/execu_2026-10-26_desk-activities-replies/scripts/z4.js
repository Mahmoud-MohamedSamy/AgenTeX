// Read-only: Reply All composer on ticket #101 (no typing; close with the composer's close/cancel, never Send or Save Draft)
await go('/tickets/details/1473172000000436038', 12000);
const ra = page.getByText('Reply All', { exact: true }).first(); await ra.click(); await sleep(7000);
out.composer = (await txt()).slice(0, 3500); out.shot = await shot('reply-composer');
out.ctrls = await vis('[title], [aria-label], button');
// send-options arrow near Send (only open the menu)
const arrows = page.locator('[data-id*="send" i] [class*="arrow" i], [data-title*="send" i], [title*="send" i]');
out.sendCtrlCount = await arrows.count();
// activity tab of the ticket
