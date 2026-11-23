// Cleanup everything this run created: QA WF rules, saved actions, tickets, contacts, account, tags; then purge QA WF items from the Recycle Bin.
const out = {}; const LG = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n');
const ids = re => [...new Set(LG.filter(l => re.test(l)).map(l => (l.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\s*$/) || [])[1]).filter(Boolean))];
// rules by name (all pages)
const rules = (await allRules()).filter(r => /^QA WF /.test(r.name) || r.name.includes('<script>'));
let rd = 0; for (const r of rules) { const d = await api('DELETE', '/workflow/rules/' + r.id); if (d.s < 300) rd++; }
out.rules = rd + '/' + rules.length;
// saved actions
const acts = arr((await api('GET', '/workflow/actions')).j?.data).filter(a => /^QA WF /.test(a.name)); let ad = 0; for (const a of acts) if ((await api('DELETE', '/workflow/actions/' + a.id)).s < 300) ad++; out.actions = ad + '/' + acts.length;
// tickets
const tix = ids(/ ticket "QA WF /); let td = 0, tgone = 0; for (const id of tix) { const d = await api('DELETE', `/modules/${T}/records/${id}`); if (d.s < 300) td++; else if (d.s === 404) tgone++; }
out.tickets = `${td} deleted, ${tgone} already gone, of ${tix.length}`;
// contacts + account (+ contacts created by the Create Record action)
const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', AM = '784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const cons = [...ids(/contact "QA WF /), '57af0d4e-1f32-4afc-9618-9cabae2bca26'];
const more = arr((await api('GET', `/modules/${CM}/records?take=100`)).j?.data).filter(r => (r.data || []).some(x => x.field === 'name' && /^QA WF /.test(dec(x.value) || ''))).map(r => r.id);
let cd = 0; const allC = [...new Set([...cons, ...more])]; for (const id of allC) if ((await api('DELETE', `/modules/${CM}/records/${id}`)).s < 300) cd++; out.contacts = cd + '/' + allC.length;
let acd = 0; const accs = ids(/account "QA WF /); for (const id of accs) if ((await api('DELETE', `/modules/${AM}/records/${id}`)).s < 300) acd++; out.accounts = acd + '/' + accs.length;
await sleep(5000);
// tags
const tg = { 'QA WF tagA': 'a41004d3-79e9-42bb-acd5-ad7fb363389b', 'QA WF tagB': '0fc9d573-2de6-4fc1-8400-ab8cb5092b2d', 'zz wf c': '7397b50e-30dd-4ebb-9abf-7e9468a7cc82', 'zz wf d': 'ba388a87-99b7-491e-ab91-2bba95ccd60a' };
out.tags = {}; for (const [n, id] of Object.entries(tg)) { const d = await api('DELETE', '/desk/tags/' + id); out.tags[n] = d.s + (d.s >= 300 ? ' ' + d.t.slice(0, 120) : ''); }
// recycle bin purge of QA WF items
let purged = 0; const leftBin = [];
for (let pass = 0; pass < 3; pass++) {
  const bin = await api('GET', '/audit/recycle-bin?take=200&app_key=desk'); const items = arr(bin.j?.data);
  const qa = items.filter(i => /QA WF |QA WF$|zz wf/.test(JSON.stringify([i.label, i.name, i.title, i.display_name, i.record_label])));
  if (!qa.length) break;
  const d = await api('POST', '/audit/recycle-bin/delete', { ids: qa.map(i => i.id) }); if (d.s < 300) purged += qa.length; else { leftBin.push(d.s + ' ' + d.t.slice(0, 150)); break; }
}
out.binPurged = purged; out.binErr = leftBin;
// verify
const left = (await allRules()).filter(r => /^QA WF /.test(r.name)).length;
const stillT = []; for (const id of tix.slice(0, 400)) { const g = await api('GET', `/modules/${T}/records/${id}`); if (g.s === 200 && !(g.j?.data?.is_deleted)) stillT.push(id); }
out.verify = { rulesLeft: left, ticketsLeft: stillT.length, savedActionsLeft: arr((await api('GET', '/workflow/actions')).j?.data).filter(a => /^QA WF /.test(a.name)).length, activeRulesNow: (await allRules()).filter(r => r.isActive).map(r => r.name) };
ledger('CLEANUP ' + JSON.stringify(out).slice(0, 600));
fs.writeFileSync(RUN + '/out/cleanup.json', JSON.stringify(out, null, 1));
return out;
