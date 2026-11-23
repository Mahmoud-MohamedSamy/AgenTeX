const LG = fs.readFileSync(RUN + '/ledger.md', 'utf8').split('\n').filter(l => l > '- 2026-11-22T22:4');
const id = re => (LG.find(l => re.test(l)) || '').match(/([0-9a-f-]{36})\s*$/)?.[1];
const out = {}; const OWN = '97be04b6-0a08-4883-aa51-e1650b11cab7';
const disp = async (t, r) => (await execs(t, r)).map(e => outcome(e) + ':' + (e.dispatches || []).map(d => d.actionType + '=' + d.status + (d.lastError ? '(' + String(d.lastError).slice(0, 160) + ')' : '') + (d.target ? ' →' + String(d.target).slice(0, 80) : '')).join(','));
for (const k of ['User', 'Team', 'UserField', 'Contact', 'RecordEmailField', 'OrgUnit', 'tpl']) { const r = id(new RegExp(`rule "QA WF AC15${k}"`)), t = id(new RegExp(`ticket "QA WF AC15${k} ticket"`)); out['AC15' + k] = r ? (t ? await disp(t, r) : 'no ticket') : 'no rule'; }
{ const r = id(/rule "QA WF AC16c"/), t = id(/ticket "QA WF AC16c ticket"/); out.AC16c = r ? await disp(t, r) : 'no rule (no agent template)'; }
for (const k of ['CL12c', 'CL12n', 'CL12e']) { const r = id(new RegExp(`rule "QA WF ${k}"`)), t = id(new RegExp(`ticket "QA WF ${k} ticket"`)); out[k] = { fired: r && t ? await fired(t, r) : 'missing', addr: t ? JSON.stringify((await getTicket(t)).qa_rt18_address || null) : null, ruleSaved: !!r }; }
const pfR = LG.filter(l => /rule "QA WF PF02 r/.test(l)).map(l => l.match(/([0-9a-f-]{36})\s*$/)[1]); const pfT = LG.filter(l => /ticket "QA WF PF02 n/.test(l)).map(l => l.match(/([0-9a-f-]{36})\s*$/)[1]);
let fr = 0, miss = 0; for (const t of pfT) { const e = (await execs(t)).filter(x => pfR.includes(x.ruleId) && outcome(x) === 'Fired').length; fr += e; if (e < 5) miss++; }
const first = LG.find(l => /ticket "QA WF PF02 n0"/.test(l)).slice(2, 21), last = LG.find(l => /ticket "QA WF PF02 n49"/.test(l)).slice(2, 21);
out.PF02 = { rules: pfR.length, tickets: pfT.length, firedRuns: fr, ticketsMissing: miss, createdFrom: first, to: last };
// PS-09 state
const ps = id(/rule "QA WF PS09"/); out.PS09 = { rule: ps, stillListed: !!(await allRules()).find(x => x.id === ps), inBin: !!arr((await api('GET', '/audit/recycle-bin/items?app_key=workflow&limit=200')).j?.data).find(i => i.record_id === ps) };
const tp = await api('GET', '/desk/email-templates'); out.tplShape = tp.s + ' ' + tp.t.slice(0, 600);
out.macroProbe = (await api('POST', '/desk/macros', {})).t.slice(0, 500);
out.fieldProbe = (await api('POST', `/modules/${T}/fields`, {})).t.slice(0, 400);
for (const [k, a] of Object.entries({ noRecipient: { type: 'Email', emailRecipients: [], emailSubject: 's', emailBody: 'b' }, noTemplateNoBody: { type: 'Email', emailRecipients: [{ kind: 'User', value: OWN }] } })) { const r = await mkRule('AC16 ' + k, { kind: 'RecordCreated' }, [a], { active: false }); out['AC16 ' + k] = r.s + ' ' + (r.err || 'saved'); if (r.id) await api('DELETE', '/workflow/rules/' + r.id); }
fs.writeFileSync(RUN + '/out/b7.json', JSON.stringify(out, null, 1));
return out;
