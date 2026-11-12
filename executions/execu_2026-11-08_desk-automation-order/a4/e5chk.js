const S = JSON.parse(fs.readFileSync('../a4/e2e25.json'));
const ex = arr2((await api('GET', `/workflow/executions?recordId=${S.e5.a}`)).j?.data).filter(e => e.ruleId === S.e5.rule);
log(JSON.stringify(ex.map(e => ({ outcome: e.outcome, d: (e.dispatches || []).map(d => d.status + ' attempts=' + d.attempts + ' resp=' + d.responseStatus + ' err=' + d.lastError + ' done=' + String(d.completedAt).slice(11, 19)) }))));
