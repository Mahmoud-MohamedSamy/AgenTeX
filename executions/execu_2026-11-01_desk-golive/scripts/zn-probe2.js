// READ-ONLY status probe of candidate GET paths (ndc-zoho/probe.txt; {D} = department id from env-like first line "#D=<id>").
async (page, ctx, blocked) => {
  const fs = require('fs'); const Z = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/ndc-zoho';
  let H = null; const on = r => { if (!H && /supportapi\/zd\/wondertravel\/api\/v1/.test(r.url()) && Object.keys(r.headers()).some(k => /csrf/i.test(k))) { const h = { ...r.headers() }; delete h.cookie; delete h.currentdepartmentid; H = h; } };
  page.on('request', on); await page.goto('https://desk.zoho.com/agent/wondertravel/all/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  for (let i = 0; i < 60 && !H; i++) await page.waitForTimeout(500); page.off('request', on); if (!H) return 'no headers';
  const lines = fs.readFileSync(Z + '/probe.txt', 'utf8').split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const D = (lines.find(x => x.startsWith('#D=')) || '#D=').slice(3); const B = 'https://desk.zoho.com/supportapi/zd/wondertravel/api/v1';
  const out = [];
  for (const l of lines.filter(x => !x.startsWith('#'))) { const p = l.replace(/\{D\}/g, D);
    const r = await ctx.request.get(B + p, { headers: H, failOnStatusCode: false, timeout: 30000 }).catch(() => null); if (!r) { out.push('ERR ' + p); continue; }
    const t = await r.text(); let n = ''; try { const j = JSON.parse(t); const a = Array.isArray(j) ? j : (j.data || null); n = Array.isArray(a) ? 'n=' + a.length + ' ' + JSON.stringify(a[0] || {}).slice(0, 140) : JSON.stringify(j).slice(0, 160); } catch (e) { n = t.slice(0, 80); }
    if (r.status() === 200) fs.writeFileSync(Z + '/api/' + p.replace(/^\//, '').replace(/[?&=\/]+/g, '_').slice(0, 120) + '.json', t);
    out.push(r.status() + ' ' + p.slice(0, 80) + ' :: ' + n); }
  return out;
}
