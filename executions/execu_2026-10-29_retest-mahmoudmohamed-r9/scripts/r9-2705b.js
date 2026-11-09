const id = 'e8f03a7b-c704-4ff5-9541-c1dc57274edc'; const r = (await api('o', 'GET', `/modules/${T.LEADS}/records/${id}`));
const d = r.j?.data; const nm = (d?.data || []).find(x => x.field === 'first_name')?.value?.value;
if (nm) ledger(`lead ${id} "${nm}" (import, held then rejected by reject_all)`);
return { status: r.s, name: nm, source: d?.source, layout: d?.created_with_layout_id, review: ((await X.reviewHistory('o', T.LEADS, id))?.cycles || []).map(c => c.status + '@' + String(c.submittedAt || c.createdAt || '').slice(11, 19)) };
