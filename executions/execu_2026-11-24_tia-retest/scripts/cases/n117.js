const r = await api('GET', '/agents/tia/status'); // warms the token so both apps share it without a refresh
return { s: r.s };
