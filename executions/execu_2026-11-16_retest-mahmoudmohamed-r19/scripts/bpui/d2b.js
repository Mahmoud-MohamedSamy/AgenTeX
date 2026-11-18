await page.goto(H + '/settings/security/audit-log', { waitUntil: 'domcontentloaded' }); await sleep(15000);
const el = page.getByText(/ndc-staging-owner signed in/).first(); await el.scrollIntoViewIfNeeded(); await page.evaluate(() => window.scrollBy(0, 0)); await sleep(1500);
const bb = await el.boundingBox(); await shot('D2-2-audit-signin.png');
const ip = page.getByText(/^IP /).filter({ hasText: /\d+\.\d+\.\d+\.\d+/ }).first(); const ib = await ip.boundingBox().catch(() => null);
return { signinBox: bb && [bb.x, bb.y, bb.width, bb.height].map(Math.round), ipBox: ib && [ib.x, ib.y, ib.width, ib.height].map(Math.round) };
