const o = {}; const bb = async (loc) => { const b = await loc.first().boundingBox().catch(() => null); return b ? [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)] : null; };
await page.setViewportSize({ width: 1600, height: 1000 });
await page.goto(H + '/views/all/tickets/94e62491-dec2-4bba-9f12-f22c572f14b8', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/QA RT12 2774 run1/.test(await text()) && /Steps|Due/.test(await text())) break; } await sleep(6000);
await shot('2774-a-run1.png');
o.steps = await bb(page.getByText(/^Due /).first()); o.lines = (await text()).split('\n').filter(l => /^Due |Warning|business time|Due 0|Due in|left/i.test(l.trim())).slice(0, 12);
const cov = page.getByText(/COVERED BY|Resolution/i).first(); await cov.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1000); await shot('2774-b-run1-sla.png'); o.sla = await bb(page.getByText(/Due \d\d\/11\/2026/).first());
return o;
