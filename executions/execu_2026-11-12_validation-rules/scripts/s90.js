const d = await api('GET', '/desk/departments'); const cs = arr(d.j && d.j.data).find(x => x.is_default);
const ch = await api('GET', '/desk/channels'); const ch2 = await api('GET', '/desk/mail/channels');
return { deptCh: JSON.stringify(cs && cs.channels).slice(0, 600), ch: ch.s + ' ' + JSON.stringify(ch.j && ch.j.data).slice(0, 400), ch2: ch2.s };
