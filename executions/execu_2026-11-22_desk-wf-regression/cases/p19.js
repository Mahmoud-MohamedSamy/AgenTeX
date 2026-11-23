const LG = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n');
const id = n => (LG.filter(l => l.includes(`"QA WF RMlay ${n}"`)).pop() || '').split(' ').pop();
const out = {};
for (const n of ['Y', 'N']) { const r = await api('GET', `/modules/${T}/records/${id(n)}`); const d = r.j?.data || {}; out[n] = { s: r.s, layout: d.layout_id || d.layoutId || d.layout, keys: Object.keys(d).join(',') }; }
const rules = arr((await api('GET', '/workflow/rules?moduleId=' + T + '&take=300')).j.data); const rl = rules.find(r => r.name === 'QA WF RMlay'); out.ruleLayout = rl && rl.layoutId;
const f = [ 'qa_ndc_company_name','qa_ndc_agency_code','qa_ndc_agency_code_2','qa_ndc_tkt_pnr_no','description','qa_ndc_agent_id','qa_ndc_issue_date','qa_ndc_billing_date','checkbox_displayed_by_layout_rules','classification','priority' ];
const a10 = await mkRule('RMa10b', { kind: 'RecordCreated' }, f.slice(0, 10).map(x => FU({ [x]: x === 'qa_ndc_agent_id' ? I(1) : x.includes('date') ? TS('2026-12-01T00:00:00') : x.startsWith('checkbox') ? B(true) : x === 'classification' ? 'others' : 'v' })), { active: false });
const a11 = await mkRule('RMa11b', { kind: 'RecordCreated' }, f.slice(0, 11).map(x => FU({ [x]: x === 'qa_ndc_agent_id' ? I(1) : x.includes('date') ? TS('2026-12-01T00:00:00') : x.startsWith('checkbox') ? B(true) : x === 'classification' ? 'others' : x === 'priority' ? 'low' : 'v' })), { active: false });
out.a10 = a10.s + ' ' + (a10.err || ''); out.a11 = a11.s + ' ' + (a11.err || '');
for (const r of [a10, a11]) if (r.id) await api('DELETE', '/workflow/rules/' + r.id);
return out;
