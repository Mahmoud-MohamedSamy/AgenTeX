const paths = ['/settings/modules-and-fields', '/settings/pipelines', '/settings/teamspace', '/settings/data-types', '/settings/capabilities', '/settings/skills', '/settings/personal/skills', '/settings/personal/locale', '/settings/company/details', '/settings/company/business-hours', '/settings/company/fiscal-year', '/settings/billing', '/settings/integration-config', '/settings/api-integration', '/settings/storage', '/settings/ai', '/settings/ai/features', '/settings/ai/health', '/settings/ai/credits', '/settings/ai/agents', '/settings/webhooks', '/settings/integrations/webhooks', '/reports', '/dashboards', '/home', '/'];
const res = [];
for (const p of paths) {
  const bad = []; const on = r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(/^https:\/\/[^/]+\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id').slice(0, 90)); };
  page.on('response', on);
  const t0 = Date.now();
  try { await page.goto(H + p, { waitUntil: 'domcontentloaded', timeout: 60000 }); } catch (e) { bad.push('goto ' + e.message.slice(0, 60)); }
  let txt = '';
  for (let i = 0; i < 30; i++) { await sleep(1000); txt = (await page.innerText('main').catch(() => page.innerText('body'))).replace(/\s+/g, ' '); if (!/Loading/i.test(txt.slice(0, 200)) && txt.length > 40) break; }
  const secs = Math.round((Date.now() - t0) / 100) / 10;
  const name = p.replace(/\//g, '_').replace(/^_/, '') || 'root';
  await shot('tour-' + name);
  page.off('response', on);
  res.push({ p, url: page.url().replace(H, ''), secs, text: txt.slice(0, 500), bad: [...new Set(bad)].slice(0, 8) });
}
return res;
