const d = await api('DELETE','/workflow/rules/cb7e6344-f00a-40b2-a5be-56ff42cbf8ac'); ledger('deleted rule TR01 cb7e6344 (criteria wiped by partial PATCH)');
// check which tickets outside QA WF were touched by TR01: list its execs again
const e = arr((await api('GET','/workflow/executions?ruleId=cb7e6344-f00a-40b2-a5be-56ff42cbf8ac&take=100')).j.data);
const foreign = []; for (const x of e) { const t = await getTicket(x.recordId); if (t.subject && !/^QA WF /.test(t.subject)) foreign.push(t.subject); }
return { del: d.s, runs: e.length, nonQaTickets: foreign };
