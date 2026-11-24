const r = short(await ask('How many open Desk tickets does QA TIA Contact A have?'));
return (r.err ? '[' + r.err + '] ' : '') + r.text.slice(0, 400);
