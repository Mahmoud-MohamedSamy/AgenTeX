const o = {}; for (const k of ['A','C','N','D']) { const v = await recVals(I[k]); o[k] = [v.score, v.last_name, v.full_name, v.lead_status]; }
return o;
