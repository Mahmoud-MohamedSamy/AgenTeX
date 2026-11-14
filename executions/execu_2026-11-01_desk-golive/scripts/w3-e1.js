await go('/settings', 10000); const inp = page.getByRole('searchbox').or(page.locator('input[placeholder=Search]')).first();
out.s = {}; for (const q of ['supervis', 'schedule', 'auto close', 'close', 'time-based', 'escalat']) { await inp.fill(q); await sleep(1500); out.s[q] = (await page.locator('aside, nav').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300); }
await shot('w3/W3-33-setup-search');
for (const r of ['/settings/automation/supervisor-rules', '/settings/automation/supervise', '/settings/automation/schedules', '/settings/automation/scheduled-actions']) { await go(r, 6000); out['r' + r] = page.url().replace(H, ''); }
const wf = await api('GET', '/workflow/meta'); out.wfMeta = wf.s + ' ' + wf.t.slice(0, 600);
return fin({ out });
