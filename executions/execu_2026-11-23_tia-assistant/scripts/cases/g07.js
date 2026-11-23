const r = await setPol(d => { d.features.tia.daily_credit_cap = 100000000; d.features.tia.monthly_credit_cap = 1; });
return { put: r.s, err: r.err?.code };
