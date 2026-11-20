const r = await api('GET', '/desk/agents/3445ec4a-020e-4f12-b156-dd2de7610164/workload'); log({ s: r.s, t: r.t.slice(0, 200) });
