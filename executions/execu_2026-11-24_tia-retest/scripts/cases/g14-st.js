for (let i = 0; i < 12; i++) { const s = (await api('GET', '/agents/tia/status')).j?.data; if (s && s.available === false) return { i, s }; await sleep(10000); }
return { timeout: true, s: (await api('GET', '/agents/tia/status')).j?.data };
