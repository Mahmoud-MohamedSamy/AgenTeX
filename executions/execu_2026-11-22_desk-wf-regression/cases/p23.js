const d = await api('DELETE', '/desk/tags/7397b50e-30dd-4ebb-9abf-7e9468a7cc82');
const b = await api('GET', '/audit/recycle-bin?take=5');
return { tagMsg: d.t.slice(0, 400), bin: b.s + ' ' + b.t.slice(0, 900) };
