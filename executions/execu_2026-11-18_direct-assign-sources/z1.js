out.status = await api(page, 'GET', 'directAssignmentRules/executionStatus');
const l = await api(page, 'GET', 'directAssignmentRules?limit=20'); out.list = { s: l.s, n: (l.j && l.j.data || []).length, t: l.s >= 300 ? l.t : undefined, sample: l.j && l.j.data && l.j.data[0] };
