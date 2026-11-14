await go('/settings/automation/sla', 10000); const inp = page.locator('#main-content input[placeholder="Search"]').first(); out.has = await inp.count();
out.s = {}; for (const q of ['supervis', 'schedul', 'close', 'time', 'rule']) { await inp.fill(q); await sleep(1500); const t = (await page.locator('#main-content').innerText()).replace(/\s+/g, ' '); out.s[q] = t.slice(t.indexOf('Set up your Desk') + 16, t.indexOf('SLA Policies')).slice(0, 250); }
await inp.fill('schedul'); await sleep(1000); await shot('w3/W3-34-setup-search-schedule'); await inp.fill('supervis'); await sleep(1000); await shot('w3/W3-33-setup-search-supervisor');
return fin({ out });
