await go('/approvals?list=requested&q=R16'); await sleep(4000);
const link = page.locator('[data-testid^="approval-ticket-link-"]').first();
return { n: await link.count(), href: await link.getAttribute('href').catch(() => null), tag: await link.evaluate(e => e.tagName).catch(() => null) };
