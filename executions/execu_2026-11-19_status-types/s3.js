const OUT = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_status-types/out/';
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', B = '3445ec4a-020e-4f12-b156-dd2de7610164', MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794';
const _api0=api; api=async(m,p,b)=>{for(let i=0;i<5;i++){const r=await _api0(m,p,b);if(r.s!==500)return r;await sleep(8000);}return _api0(m,p,b);};
const rows = ['tickets.jsonl', 'tickets2.jsonl', 'tickets3.jsonl'].flatMap(f => { try { return fs.readFileSync(OUT + f, 'utf8').split(String.fromCharCode(10)).filter(Boolean).map(l => JSON.parse(l)); } catch (e) { return []; } }).filter(r => r.id);
const res = [];
for (const r of rows) { const t = (await api('GET', '/desk/tickets/' + r.id)).j?.data || {}; res.push({ status: r.status, type: r.type, nowStatus: t.status, closed_at: t.closed_at, closed_by: t.closed_by ? 'set' : null }); }
const wl0 = JSON.parse(fs.readFileSync(OUT + 'wl0.json', 'utf8')); const wl1 = (await api('GET', '/desk/agents/' + B + '/workload')).j?.data;
const dep = x => (x?.departments || []).find(d => d.department_id === MK) || {};
const exp = { open: res.filter(x => x.type === 'open').length, on_hold: res.filter(x => x.type === 'on_hold').length, closed: res.filter(x => x.type === 'closed').length };
fs.writeFileSync(OUT + 'measure1.json', JSON.stringify({ res, wl0: dep(wl0), wl1: dep(wl1), exp }, null, 1));
const bad = res.filter(x => (x.type === 'closed') !== !!x.closed_at || x.nowStatus !== x.status);
log({ n: res.length, exp, wlBefore: dep(wl0), wlAfter: dep(wl1) });
log({ closedAtWrong: bad.map(x => x.status + ' [' + x.type + '] now=' + x.nowStatus + ' closed_at=' + (x.closed_at || 'empty')) });
