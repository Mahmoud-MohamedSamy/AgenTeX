// A4 batch 6 (12 Nov): F18 merge cases one by one; template / role / agent lookups for I19-I21, I9.
const R = {}; const cut = (x, n = 300) => String(typeof x === 'string' ? x : JSON.stringify(x)).slice(0, n); const S = v => ({ kind: 'string', stringValue: v });
const r = await api('GET', '/desk/email-templates?per_page=200'); const d = r.j?.data;
const L = Array.isArray(d) ? d : (d?.items || d?.templates || d?.data || Object.values(d || {}).find(Array.isArray) || []);
R.tplCount = L.length; R.useCases = [...new Set(L.map(t => t.use_case))].slice(0, 40); R.tplKeys = L[0] ? Object.keys(L[0]).join(',') : '';
const roles = arr2((await api('GET', '/iam/org-units')).j?.data); R.roleKeys = roles[0] ? Object.keys(roles[0]).join(',') : ''; R.roles = roles.slice(0, 6).map(x => cut(x, 120));
const us = await api('GET', '/iam/users?search=QA%20AO%20WF'); R.userSearch = us.s + ' ' + cut(arr2(us.j?.data).map(u => [u.id, u.name || u.display_name, u.status]), 300);
const cases = [['recordId', 'R[' + '$' + '{recordId}]'], ['moduleId', 'M[' + '$' + '{moduleId}]'], ['subject', 'S[' + '$' + '{subject}]'], ['literal', 'L[' + '$$' + '{x}]'], ['unclosed', 'O[' + '$' + '{subject] end']];
for (const [k, v] of cases) {
  const f = await mkRule('F18' + k, { kind: 'RecordCreated' }, [{ type: 'FieldUpdate', fieldUpdates: { description: S(v) } }]);
  const t = await mkTicket('F18' + k); await waitExec(t.id, 1, 45); await sleep(3000);
  const a = (await api('GET', '/modules/' + T + '/records/' + t.id)).j?.data?.data || [];
  R['F18_' + k] = v + ' => ' + cut((a.find(x => x.field === 'description') || {}).value, 160);
  await api('DELETE', '/workflow/rules/' + f.id);
}
return R;
