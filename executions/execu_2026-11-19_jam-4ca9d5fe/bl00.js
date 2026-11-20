const rr = await api('GET', '/desk/assignment-rules?type=round_robin'); log({ s: rr.s, keys: Object.keys(rr.j?.data || {}), sample: JSON.stringify(rr.j?.data).slice(0, 400) });
