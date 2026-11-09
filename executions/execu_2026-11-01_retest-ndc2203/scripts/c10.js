const A = "fd4e1ad6-a3b4-4e57-a583-f154920c0fcb", O = "ff14a87b-f467-440b-b4d1-07234ac53de1"; const out = {};
const ta = await getTicket(A); out.E1a = { account_id: ta.account_id };
if (ta.account_id) { const g = (await api("GET", "/modules/784400e1-4a2a-42c2-b4f3-7ca56e79828a/records/" + ta.account_id)).j?.data; const d = {}; for (const x of g?.data || []) d[x.field] = val(x.value); out.E1a.accountDesc = d.description; }
out.E1aEx = arr((await api("GET", "/workflow/executions?recordId=" + A)).j?.data).map(e => e.ruleId.slice(0, 8) + " matched=" + e.criteriaMatched + " " + e.outcome + " " + JSON.stringify(e.details || "").slice(0, 300));
const to = await getTicket(O); out.E3od = { due: to.due_date, status: to.status, response_due: to.response_due };
out.E3odEx = arr((await api("GET", "/workflow/executions?recordId=" + O)).j?.data).map(e => e.ruleId.slice(0, 8) + " matched=" + e.criteriaMatched + " " + e.outcome + " " + JSON.stringify(e.details || "").slice(0, 300));
return fin(out);