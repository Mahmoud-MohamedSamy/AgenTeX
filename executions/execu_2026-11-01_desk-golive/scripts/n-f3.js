const o = []; for (let i = 0; i < 3; i++) { const r = await api('GET', '/iam/tenant/company-profile'); const d = r.j && r.j.data; o.push({ s: r.s, tz: d && d.time_zone, tzv: d && d.time_zone_version, upd: d && d.updated_at, by: d && d.updated_by }); await sleep(1500); }
const bh = await api('GET', '/iam/tenant/business-hours'); o.push({ bh_tz: bh.j && bh.j.data && bh.j.data.time_zone });
return done(o);
