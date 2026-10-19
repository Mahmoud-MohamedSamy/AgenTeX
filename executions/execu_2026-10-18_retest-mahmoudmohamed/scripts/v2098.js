const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const vs = await api('GET', '/modules/' + L + '/views?kind=list'); const vl = arr(vs.j.data.views);
out.myViews = vl.filter(v => v.owner_user_id === '97be04b6-0a08-4883-aa51-e1650b11cab7').map(v => v.name + '|' + v.id).slice(0, 8);
out.foreignVisible = vl.some(v => v.id === '4495c2fb-f02e-4003-9437-a2b0010a0849');
const fg = await api('GET', '/modules/' + L + '/views/4495c2fb-f02e-4003-9437-a2b0010a0849'); out.foreignGet = fg.s;
const dg = await api('GET', '/modules/' + L + '/views/0b48bfa9-555c-40e4-b744-6e5eb702b8a4'); out.deletedGet = dg.s;
const lp = await api('GET', '/modules/' + L + '/list-preferences'); out.lastView = lp.t.match(/"last[^"]*view[^"]*":"?[^,"]*/gi);
return done(out);
