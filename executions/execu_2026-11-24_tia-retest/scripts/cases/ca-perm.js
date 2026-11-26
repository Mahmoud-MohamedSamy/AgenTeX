const me = (await api('GET', '/iam/users/me')).j?.data; const e = await api('GET', '/workflow/custom-actions?limit=5'); const run = await api('POST', '/workflow/custom-actions/590ca067-af23-4a3e-92e2-955dbb6260de/run', { inputs: { pnrOrReference: 'QATEST1' } });
return { listActions: e.s, directRun: { s: run.s, b: (run.t || '').slice(0, 200) } };
