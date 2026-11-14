const N = ['Actions', 'Support Plans', 'AI Tagging', 'Ticket Archiving', 'Time Tracking', 'Data Archive', 'Data Retention', 'Custom Actions'];
out.p = {};
for (const n of N) { await go('/settings/automation/sla', 8000);
  const el = page.getByText(n, { exact: true }).first(); await el.click({ timeout: 8000 }).catch(e => out.p[n] = 'click failed'); await sleep(9000);
  const t = await mtxt(); const i = t.lastIndexOf('Email Providers'); out.p[n] = page.url().replace(H, '') + ' :: ' + t.slice(i > 0 ? i + 15 : 0, (i > 0 ? i : 0) + 1800);
  await shot('w3/p2-' + n.replace(/\W+/g, '_')); }
const seen = new Set(); out.api = NET.filter(n => !/presence|resolved-batch|realtime|notifications/.test(n.u)).map(n => n.m + ' ' + n.u.split('?')[0] + ' ' + n.s).filter(x => !seen.has(x) && seen.add(x));
return fin({ out });
