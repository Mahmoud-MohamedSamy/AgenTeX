// READ-ONLY bulk GET against NDC Zoho Desk internal API. Endpoints come from ndc-zoho/endpoints.txt (one path per line,
// {DEPT} expands to every department id). Saves each body to ndc-zoho/api/<slug>.json and returns a status summary.
async (page, ctx, blocked) => {
  const fs = require('fs'); const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/ndc-zoho';
  fs.mkdirSync(D + '/api', { recursive: true });
  let H = null; const on = r => { if (!H && /supportapi\/zd\/wondertravel\/api\/v1/.test(r.url()) && Object.keys(r.headers()).some(k => /csrf/i.test(k))) { const h = { ...r.headers() }; delete h.cookie; H = h; } };
  page.on('request', on); await page.goto('https://desk.zoho.com/agent/wondertravel/all/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  for (let i = 0; i < 60 && !H; i++) await page.waitForTimeout(500); page.off('request', on); if (!H) return 'no headers captured';
  delete H['currentdepartmentid'];
  const B = 'https://desk.zoho.com/supportapi/zd/wondertravel/api/v1';
  const get = async p => { const r = await ctx.request.get(B + p, { headers: H, failOnStatusCode: false, timeout: 30000 }).catch(e => null); if (!r) return { s: 0, t: '' }; return { s: r.status(), t: await r.text() }; };
  let depts = []; try { depts = JSON.parse(fs.readFileSync(D + '/api/departments.json', 'utf8')).data.map(d => d.id); } catch (e) { const r = await get('/departments?limit=100'); fs.writeFileSync(D + '/api/departments.json', r.t); try { depts = JSON.parse(r.t).data.map(d => d.id); } catch (e2) {} }
  const lines = fs.readFileSync(D + '/endpoints.txt', 'utf8').split(/\r?\n/).map(x => x.trim()).filter(x => x && !x.startsWith('#'));
  const out = [];
  for (const l of lines) { const paths = l.includes('{DEPT}') ? depts.map(d => l.replace(/\{DEPT\}/g, d)) : [l];
    for (const p of paths) { const r = await get(p); const slug = p.replace(/^\//, '').replace(/[?&=\/]+/g, '_').slice(0, 120);
      if (r.s === 200) fs.writeFileSync(D + '/api/' + slug + '.json', r.t);
      let n = ''; try { const j = JSON.parse(r.t); const a = Array.isArray(j) ? j : (j.data || j.list || null); n = Array.isArray(a) ? 'n=' + a.length : Object.keys(j).slice(0, 8).join(','); } catch (e) { n = r.t.slice(0, 80); }
      out.push(r.s + ' ' + p.slice(0, 90) + ' :: ' + String(n).slice(0, 120)); } }
  return { depts: depts.length, out, blockedTail: blocked.slice(-5) };
}
