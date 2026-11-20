const m=(await api('GET','/modules?take=200')).j?.data;const a=Array.isArray(m)?m:arr(m);return Object.keys(a[0]).concat([JSON.stringify(a[0]).slice(0,400)]);
