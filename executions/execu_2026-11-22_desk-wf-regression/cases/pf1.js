const out = {};
for (const f of ['threadCount', 'commentCount', 'recentComment', 'recentCommentType', 'isOverdue', 'executionTime', 'facts.threadCount', 'nonexistent_field_zz']) {
  const c = f.includes('Count') ? cmp(f, 'GreaterThan', I(0)) : f === 'isOverdue' ? cmp(f, 'Equal', B(true)) : f === 'executionTime' || f === 'recentCommentType' ? cmp(f, 'Equal', S(f === 'executionTime' ? 'business_hours' : 'private')) : sm(f, 'Contains', 'x');
  const r = await mkRule('PF1 ' + f, { kind: 'RecordUpdated' }, [FU({ qa_ndc_agency_code: 'WF' })], { criteria: c, active: false });
  out[f] = r.s + ' ' + (r.err || '').slice(0, 200);
  if (r.id) { const g = arr((await api('GET', `/workflow/rules?moduleId=${T}&take=200`)).j?.data).find(x => x.id === r.id); out[f] += ' stored=' + JSON.stringify(g && g.criteria).slice(0, 220); await api('DELETE', '/workflow/rules/' + r.id); }
}
return out;
