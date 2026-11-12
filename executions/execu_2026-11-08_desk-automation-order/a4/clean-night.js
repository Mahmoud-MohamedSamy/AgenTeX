// Cleanup 12 Nov night run: every rule/ticket tracked since 21:00 UTC + extra objects.
const L = JSON.parse(fs.readFileSync(LEDGER, 'utf8')).filter(x => x.at >= '2026-11-12T21:00');
const R = { rules: {}, tickets: {} }; const cnt = (o, s) => o[s] = (o[s] || 0) + 1;
for (const x of L.filter(x => x.k === 'rule')) cnt(R.rules, (await api('DELETE', '/workflow/rules/' + x.id)).s);
const left = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(r => /^QA AO WF/.test(r.name));
for (const r of left) cnt(R.rules, 'extra ' + (await api('DELETE', '/workflow/rules/' + r.id)).s);
const ids = [...new Set(L.filter(x => x.k === 'ticket').map(x => x.id))];
for (const id of ids) cnt(R.tickets, (await api('DELETE', `/modules/${T}/records/${id}`)).s);
const S = JSON.parse(fs.readFileSync('../a4/e2e134.json')); const i10 = JSON.parse(fs.readFileSync('../a4/i10.json'));
R.savedAction = (await api('DELETE', '/workflow/actions/' + S.made.actions[0])).s;
R.templates = await Promise.all(S.made.tpl.map(async t => (await api('DELETE', '/desk/email-templates/' + t)).s));
R.tags = await Promise.all(S.made.tags.map(async t => (await api('DELETE', '/desk/tags/' + t)).s));
R.assignRule = (await api('DELETE', '/desk/assignment-rules/' + i10.ARID)).s;
const W5 = JSON.parse(fs.readFileSync('../a4/e2e25.json')).w5; R.webhookToken = (await fetch('https://webhook.site/token/' + W5, { method: 'DELETE' })).status;
// verify
R.after = { qaRules: arr2((await api('GET', '/workflow/rules?take=500')).j?.data).filter(r => /^QA AO WF/.test(r.name)).length, rulesTotal: arr2((await api('GET', '/workflow/rules?take=500')).j?.data).length,
  qaTags: arr2((await api('GET', '/desk/tags?take=500')).j?.data?.tags || (await api('GET', '/desk/tags?take=500')).j?.data).filter(t => /^QA WF/.test(t.name)).length,
  qaTpl: ((await api('GET', '/desk/email-templates?take=200')).j?.data?.email_templates || []).filter(t => /^QA AO WF/.test(t.name)).length,
  qaActions: arr2((await api('GET', '/workflow/actions?take=200')).j?.data).filter(a => /^QA AO WF/.test(a.name)).length,
  directSwitch: (await api('GET', '/desk/assignment/notification-settings')).j?.data?.direct_rules_enabled,
  hours: (await api('GET', '/desk/business-hours')).j?.data?.preset, deptA: ((await api('GET', `/desk/departments/${D}`)).j?.data?.agent_user_ids || []).length,
  happiness: (await api('GET', '/desk/happiness/settings')).j?.data?.is_enabled };
fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' night cleanup ' + JSON.stringify(R) + '\n'); log(JSON.stringify(R, null, 1));
