// Lists (and with --clean, removes) leftover "QA BP" blueprints and tickets. Only QA BP records are touched.
const H = 'https://staging-desk.taviportal.com/api/v1', T = 'e8e5e302-3873-4e32-b945-c9cd25c7659d';
const BASE = { 'content-type': 'application/json', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000002', 'x-app-key': 'desk' }; let tok;
const call = async (m, p, b) => { const r = await fetch(H + p, { method: m, headers: { ...BASE, authorization: 'Bearer ' + tok }, body: b === undefined ? undefined : JSON.stringify(b) }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return { s: r.status, j }; };
(async () => {
  tok = (await (await fetch(H + '/iam/auth/login', { method: 'POST', headers: BASE, body: JSON.stringify({ email: 'anyware-staging-owner@anyware.software', password: process.env.P, device_label: 'qa-automation', remember_me: true }) })).json()).data.access_token;
  const clean = process.argv.includes('--clean');
  const bps = (await call('GET', `/modules/${T}/blueprints?includeInactive=true`)).j.data.filter(b => String(b.definition.name).startsWith('QA BP '));
  const tickets = []; for (let skip = 0; skip < 600; skip += 100) { const r = await call('GET', `/modules/${T}/records?take=100&skip=${skip}`); const d = (r.j && r.j.data) || []; for (const x of d) { const s = (x.data || []).find(f => f.field === 'subject'); const v = s && (s.value && s.value.value !== undefined ? s.value.value : s.value); if (/^QA BP |^Probe QA/.test(String(v))) tickets.push([x.id, v]); } if (d.length < 100) break; }
  console.log('QA BP blueprints:', bps.map(b => b.definition.name + ' ' + b.id).join(' | ') || 'none');
  console.log('QA BP tickets:', tickets.map(t => t[1]).join(' | ') || 'none');
  if (clean) { for (const [id] of tickets) { await call('POST', `/desk/tickets/${id}/blueprint/revoke`, {}); console.log('del ticket', (await call('DELETE', `/modules/${T}/records/${id}`)).s); }
    for (const b of bps) { await call('POST', `/desk/blueprints/${b.id}/revoke`, { ticket_ids: null, after: null }); console.log('del bp', (await call('DELETE', `/modules/${T}/blueprints/${b.id}`)).s); } }
})().catch(e => console.error('ERR', e.message));
