// Lists (and with --clean, removes) leftover "QA BP" blueprints and tickets. Only QA BP records are touched.
// Uses tv.js (cached owner token); --clean also removes QA BP workflow rules and SLA policies.

const tv = require('./tv'); const T = tv.TICKETS;

const call = async (m, p, b) => { const r = await tv.call(m, p, b); return { s: r.status, j: r.json }; };
(async () => {

  const clean = process.argv.includes('--clean');
  const bps = (await call('GET', `/modules/${T}/blueprints?includeInactive=true`)).j.data.filter(b => String(b.definition.name).startsWith('QA BP '));
  const tickets = []; for (let skip = 0; skip < 600; skip += 100) { const r = await call('GET', `/modules/${T}/records?take=100&skip=${skip}`); const d = (r.j && r.j.data) || []; for (const x of d) { const s = (x.data || []).find(f => f.field === 'subject'); const v = s && (s.value && s.value.value !== undefined ? s.value.value : s.value); if (/^QA BP |^Probe QA/.test(String(v))) tickets.push([x.id, v]); } if (d.length < 100) break; }
  console.log('QA BP blueprints:', bps.map(b => b.definition.name + ' ' + b.id).join(' | ') || 'none');
  console.log('QA BP tickets:', tickets.map(t => t[1]).join(' | ') || 'none');
  if (clean) { for (const [id] of tickets) { await call('POST', `/desk/tickets/${id}/blueprint/revoke`, {}); console.log('del ticket', (await call('DELETE', `/modules/${T}/records/${id}`)).s); }
    for (const b of bps) { await call('POST', `/desk/blueprints/${b.id}/revoke`, { ticket_ids: null, after: null }); console.log('del bp', (await call('DELETE', `/modules/${T}/blueprints/${b.id}`)).s); } }
})().catch(e => console.error('ERR', e.message));
(async () => { const r = await tv.call('GET', '/workflow/rules?take=200'); const rules = ((r.json && (r.json.data.items || r.json.data)) || []).filter(x => String(x.name).startsWith('QA BP '));
  const s = await tv.call('GET', '/desk/sla/policies'); const pols = ((s.json && s.json.data) || []).filter(x => String(x.name).startsWith('QA BP '));
  console.log('QA BP rules:', rules.map(x => x.name).join(' | ') || 'none', '; QA BP SLA:', pols.map(x => x.name).join(' | ') || 'none');
  if (process.argv.includes('--clean')) { for (const x of rules) console.log('del rule', (await tv.call('DELETE', '/workflow/rules/' + x.id)).status); for (const x of pols) console.log('del sla', (await tv.call('DELETE', '/desk/sla/policies/' + x.id)).status); } })();
