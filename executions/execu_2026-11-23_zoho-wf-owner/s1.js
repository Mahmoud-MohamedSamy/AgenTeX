await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/setup', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
for (const t of ['Remind me later', 'Skip', 'Close', 'Got it']) { const l = page.getByText(t, { exact: true }); if (await l.count()) await l.first().click().catch(() => {}); }
await shot('1-setup'); const t = await body(); const i = t.indexOf('Workflows'); out.around = t.slice(Math.max(0, i - 200), i + 300);
const w = page.getByText('Workflows', { exact: true }); out.wf = await w.count(); if (out.wf) { await w.first().click(); await sleep(8000); await shot('2-workflows'); out.after = (await body()).slice(0, 1200); out.url = page.url(); out.frames = page.frames().map(f => f.url().slice(0, 100)); }
