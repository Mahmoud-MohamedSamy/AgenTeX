const f = arr((await api('GET', '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/fields')).j.data);
const pick = k => { const x = f.find(y => (y.apiName || y.api_name || y.key) === k); return x ? JSON.stringify(x).slice(0, 900) : null; };
return { currency: pick('currency'), exchange_rate: pick('exchange_rate'), amount: pick('amount') };
