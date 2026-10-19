const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {};
const q = await api('GET', '/modules/' + D + '/records?page=1&per_page=5&filters=' + encodeURIComponent(JSON.stringify([{ field: 'deal_name', operator: 'starts_with', value: 'QA RT ap' }])));
out.deals = arr(q.j && q.j.data).map(r => ({ id: r.id, name: ((r.data || []).find(f => f.field === 'deal_name') || { value: {} }).value.value, approval: ((r.data || []).find(f => f.field === 'approval_status') || { value: {} }).value.value }));
for (const p of ['/workflow/approvals?status=pending', '/workflow/approvals', '/workflow/approval-requests?status=pending', '/workflow/approval-requests', '/workqueue/jobs/approvals', '/workqueue/approvals']) { const r = await api('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 220); }
return out;
