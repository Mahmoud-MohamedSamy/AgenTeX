const R = ['/modules/0924eb24-e42a-4eab-8efd-e3428f19e882','/modules/784400e1-4a2a-42c2-b4f3-7ca56e79828a','/modules/95b45992-5beb-4f23-b619-e3ae0e304933','/analytics/reports','/analytics/advanced','/settings/data/sandboxes','/settings/data/recycle-bin','/settings/data/audit-log','/settings/audit-log','/settings/integrations/custom-actions','/settings/integrations/email-providers','/settings/organization/signals','/settings/customize/home-page','/settings/modules-and-fields','/settings/integrations/crm'];
out.p = {};
for (const r of R) { await page.goto(H + r, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {}); await sleep(9000);
  const t = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  out.p[r] = page.url().replace(H, '') + ' :: ' + t.slice(0, 420);
  await page.screenshot({ path: SHOT + '/w5/probe2' + r.replace(/\//g, '_') + '.png' }).catch(() => {}); }
return fin({ out });
