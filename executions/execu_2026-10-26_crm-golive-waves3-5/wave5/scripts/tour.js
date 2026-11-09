const paths = ['/settings/modules-and-fields', '/settings/teamspace', '/settings/data-types', '/settings/capabilities', '/settings/skills', '/settings/personal/skills', '/settings/personal/locale', '/settings/company/details', '/settings/company/business-hours', '/settings/company/fiscal-year', '/settings/billing', '/settings/integration-config', '/settings/api-integration', '/settings/storage', '/settings/ai', '/settings/ai/features', '/settings/ai/health', '/settings/ai/credits', '/reports', '/dashboards', '/'];
const out = [];
for (const p of paths) {
  const bad = []; const on = r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(/^https:\/\/[^/]+\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id').slice(0, 90)); };
  page.on('response', on);
  const t0 = Date.now();
  try { await page.goto('https://staging-crm.taviportal.com' + p, { waitUntil: 'domcontentloaded', timeout: 60000 }); } catch (e) { bad.push('goto ' + e.message.slice(0, 60)); }
  let txt = '';
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(1000); txt = (await page.innerText('main').catch(() => page.innerText('body'))).replace(/\s+/g, ' '); if (!/Loading/i.test(txt.slice(0, 200)) && txt.length > 40) break; }
  const name = p.replace(/\//g, '_').replace(/^_/, '') || 'home';
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave5/evidence/raw/tour-' + name + '.png' });
  page.off('response', on);
  out.push({ p, url: page.url().replace('https://staging-crm.taviportal.com', ''), secs: Math.round((Date.now() - t0) / 100) / 10, text: txt.slice(0, 420), bad: [...new Set(bad)].slice(0, 8) });
}
return out;
