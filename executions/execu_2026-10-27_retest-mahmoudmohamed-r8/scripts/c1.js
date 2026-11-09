const out = {};
for (const [k, id] of [['converted', '3a22e4a4-5b26-441e-905c-c5fb4f3315ce'], ['control', '5898eb60-6024-4d73-ab96-df88657153f0']]) {
  out[k] = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => e.triggerKind + ' ' + e.outcome + ' ' + (e.dispatches || []).map(d => d.actionType + ':' + d.status + ' attempts=' + d.attempts + ' next=' + (d.nextAttemptAt || '').slice(11, 19) + ' done=' + (d.completedAt || '').slice(11, 19) + ' ' + String(d.lastError || d.responseStatus || '')).join('; '));
}
return done(out);
