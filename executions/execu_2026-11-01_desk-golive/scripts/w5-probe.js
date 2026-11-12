const R = ['/customers','/contacts','/accounts','/contracts','/activities','/calendar','/hq','/analytics','/reports','/dashboards','/team-feeds',
 '/settings/data/import','/settings/data/export','/settings/data/backup','/settings/data/migration','/settings/data/sandboxes','/settings/data/bulk-actions','/settings/data/recycle-bin','/settings/data/archive','/settings/data/retention',
 '/settings/modules-and-fields','/settings/organize-tabs','/settings/layout-rules','/settings/validation-rules','/settings/languages','/settings/data-types','/settings/capabilities',
 '/settings/integrations/crm','/settings/integrations/collaboration','/settings/integration-config','/settings/organization/products','/settings/accessibility','/settings/my-profile',
 '/settings/privacy','/settings/webhooks','/settings/api-keys','/settings/developer','/settings/buttons','/settings/marketplace'];
out.pages = {};
for (const r of R) {
  const n0 = NET.length; const errs = [];
  await page.goto(H + r, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => errs.push(e.message.slice(0, 60))); await sleep(7000);
  const body = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ');
  const h = (await page.locator('main h1, main h2').allInnerTexts().catch(() => [])).map(s => s.trim()).filter(Boolean).slice(0, 4);
  const bad = NET.slice(n0).filter(x => x.s >= 400).map(x => x.s + ' ' + x.m + ' ' + x.u.split('?')[0].slice(-60)).slice(0, 4);
  out.pages[r] = { url: page.url().replace(H, ''), h, err: (body.match(/(something went wrong|not found|error|in development|coming soon|loading your[^.]{0,40})/i) || [''])[0], bad, txt: body.slice(0, 160) };
  await page.screenshot({ path: SHOT + '/w5/probe' + r.replace(/\//g, '_') + '.png' }).catch(() => {});
}
return fin({ out });
