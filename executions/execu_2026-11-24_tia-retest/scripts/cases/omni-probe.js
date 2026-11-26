const o = {};
o.status = (await api('GET', '/agents/tia/status')).t?.slice(0, 200);
o.caps = (await api('GET', '/agents/tia/capabilities')).t?.slice(0, 300);
return o;
