const paths = ['/settings/teamspace', '/settings/skills', '/settings/personal/skills', '/settings/company/business-hours', '/settings/company/fiscal-year', '/settings/billing', '/settings/integration-config', '/settings/integrations/ai', '/settings/integrations/ai-credits'];
const out = [];
const content = async () => { const t = await page.innerText('body').catch(() => ''); const i = t.lastIndexOf('Storage Requests'); return (i > 0 && t.indexOf('Setup Home') >= 0 ? t.slice(i + 16) : t).replace(/\s+/g, ' ').trim(); };
for (const p of paths) {
  const bad = []; const on = r => { if (r.status() >= 400 && /\/api\//.test(r.url())) bad.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(/^https:\/\/[^/]+\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, ':id').slice(0, 90)); };
  page.on('response', on); const t0 = Date.now();
  try { await page.goto('https://staging-crm.taviportal.com' + p, { waitUntil: 'domcontentloaded', timeout: 60000 }); } catch (e) { bad.push('goto ' + e.message.slice(0, 60)); }
  let txt = ''; let ready = -1;
  for (let i = 0; i < 50; i++) { await page.waitForTimeout(1000); txt = await content(); if (!/Loading/.test(txt.replace(/Set up your CRM Loading…/, '')) && txt.length > 30) { ready = (Date.now() - t0) / 1000; break; } }
  const name = p.replace(/\//g, '_').replace(/^_/, '') || 'home';
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-26_crm-golive-waves3-5/wave5/evidence/raw/tour3-' + name + '.png' });
  page.off('response', on);
  out.push({ p, url: page.url().replace('https://staging-crm.taviportal.com', ''), ready, text: txt.slice(0, 700), bad: [...new Set(bad)].slice(0, 8) });
}
return out;
