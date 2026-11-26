eval(require('fs').readFileSync(require('path').join(process.cwd(), 'zlib.js'), 'utf8'));
await page.goto('https://desk.zoho.com/agent/techegysolutions/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => {});
await sleep(12000); out.url = page.url().replace(/\?.*/, ''); out.signedIn = !/accounts\.zoho/.test(page.url());
if (!out.signedIn) return;
const pr = await api('GET', B + 'profiles'); out.profiles = pr.s + ' ' + (JSON.parse(pr.t || '{}').data || []).map(p => p.name + ':' + p.id).join(', ');
const ag = (JSON.parse(pr.t || '{}').data || []).find(p => /^Agent$/i.test(p.name));
if (ag) { const d = await api('GET', B + 'profiles/' + ag.id); const j = JSON.parse(d.t || '{}'); const perm = j.permissions || j;
  const flat = []; (function w(o, p) { for (const k in o) { const v = o[k], q = p ? p + '.' + k : k; if (v && typeof v === 'object') w(v, q); else if (/time|child|parent|resolution/i.test(q)) flat.push(q + '=' + v); } })(perm, '');
  out.agentPerms = d.s + ' ' + flat.join(' | ').slice(0, 1500); }
const ts = await api('GET', B + 'timeTrackSettings?departmentId=' + D); out.timeTrack = ts.s + ' ' + ts.t.slice(0, 600);
await shot('z1-tickets');
