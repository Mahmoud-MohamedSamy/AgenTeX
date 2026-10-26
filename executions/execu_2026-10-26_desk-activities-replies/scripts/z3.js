// Read-only: tickets list, first ticket, reply composer (opened < 60 s, no typing, closed without saving)
await go('/tickets/list/all-cases', 10000);
out.list = (await txt()).slice(0, 1200);
const a = page.locator('a[href*="/tickets/details/"], a[href*="/tickets/"][href*="/conversation"]').first();
if (await a.count()) { await a.click(); await sleep(9000);
  out.ticketUrl = page.url(); out.ticket = (await txt()).slice(0, 2500); out.ticketShot = await shot('ticket');
  const r = page.locator('button, span, a').filter({ hasText: /^\s*Reply\s*$/ }).first();
  try { await r.click({ timeout: 8000 }); await sleep(6000); out.composer = (await txt()).slice(0, 3000); out.composerShot = await shot('reply-composer'); out.composerCtrls = await vis('button, [title], [aria-label]'); } catch (e) { out.replyErr = String(e.message).slice(0, 120); }
}
