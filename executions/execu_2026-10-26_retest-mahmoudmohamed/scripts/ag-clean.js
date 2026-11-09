// As the Desk Agent: delete (or, if not allowed, close) the 3 QA WF tickets the admin cannot open. Name checked first.
const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const out = {};
for (const id of ['7644ce9e-0fe6-44da-99f1-79f58bfb0d45', '70c80b92-d7ac-4c15-b0f6-4e76d8a9139c', '36777aa3-d84a-4c6e-8de9-95d67f397b2c']) {
  const g = await api('GET', `/modules/${T}/records/${id}`); const subj = (g.j?.data?.data || []).find(x => x.field === 'subject')?.value?.value || '';
  if (!/^QA WF /.test(subj)) { out[id.slice(0, 8)] = 'skipped ' + g.s + ' ' + subj; continue; }
  const d = await api('DELETE', `/modules/${T}/records/${id}`);
  if (d.s < 300) { out[id.slice(0, 8)] = subj + ' → deleted ' + d.s; continue; }
  const c = await api('POST', `/desk/tickets/${id}/close`, {}); out[id.slice(0, 8)] = subj + ' → delete ' + d.s + ', close ' + c.s;
}
return out;
