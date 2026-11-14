const TM = '88e8ea44-1658-4df3-9930-d0902b91073d', T = 'f64e2ab2-83ae-4ec8-9441-ee94d302d8bd';
const tf = await api('GET', '/modules/' + TM + '/fields'); out.fs = tf.s; const list = arr(D(tf.j)); out.prod = list.filter(f => /product/i.test(JSON.stringify(f).slice(0, 300))).map(f => JSON.stringify(f).slice(0, 250));
const tr = await api('GET', '/modules/' + TM + '/records/' + T); out.rec = (D(tr.j).data || []).filter(d => /product/.test(d.field));
const dt = await api('GET', '/desk/tickets/' + T); out.desk = (dt.t.match(/"product[^,]*,[^,]*/g) || []).join(' ');
return fin({ out });
