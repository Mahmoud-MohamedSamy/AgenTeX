await page.goto(H + '/settings/automation/workflow-rules', { waitUntil: 'commit' }); await page.getByText('Workflow Rules').first().waitFor({ timeout: 150000 }); await sleep(4000);
for (const s of ['CHANNELS', 'SELF SERVICE']) { const h = page.getByText(s, { exact: true }).first(); if (await h.count()) { await h.click().catch(() => {}); await sleep(1500); } }
const t = await text(); const i = t.indexOf('CHANNELS'); log(t.slice(i, i + 400).replace(/\s+/g, ' | '));
const links = await page.$$eval('a', as => as.map(a => a.getAttribute('href')).filter(h => h && /channel|form|widget|help/i.test(h))); log([...new Set(links)]);
await shot('DA-settings-channels.png');
