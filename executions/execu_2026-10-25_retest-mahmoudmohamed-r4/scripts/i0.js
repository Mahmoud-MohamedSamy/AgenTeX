const B = '/desk/integrations/crm';
const st = await api('GET', B + '/status'); const cf = await api('GET', B + '/config');
return done({ status: st.s + ' ' + st.t.slice(0, 400), configStatus: cf.s, rowVersion: cf.j?.data?.row_version, config: cf.j?.data });
