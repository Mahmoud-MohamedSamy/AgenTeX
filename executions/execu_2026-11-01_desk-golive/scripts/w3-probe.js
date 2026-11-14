const R = ['/settings/automation','/settings/automation/support-plans','/settings/automation/ai-tagging','/settings/integrations/custom-actions','/settings/data/data-archive','/settings/data/archive','/settings/automation/supervisor-rules','/settings/automation/schedules','/settings/automation/sla','/modules/95b45992-5beb-4f23-b619-e3ae0e304933'];
out.p = {};
for (const r of R) { await page.goto(H + r, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {}); await sleep(8000);
  const t = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  out.p[r] = page.url().replace(H, '') + ' :: ' + t.slice(0, 900);
  await page.screenshot({ path: SHOT + '/w3/probe' + r.replace(/\//g, '_') + '.png' }).catch(() => {}); }
out.apis = [...new Set(NET.map(n => (n.m||n.method||'') + ' ' + String(n.u||n.url||'').replace(/^https?:\/\/[^/]+/, '').split('?')[0]))].filter(x => !/\.(js|css|png|svg|woff)/.test(x)).slice(0, 120);
return fin({ out });
