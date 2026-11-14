const cs = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
const one = await api('GET', '/modules/' + TM + '/records?page=1&per_page=1'); const rec0 = arr(D(one.j))[0] || {}; out.keys = Object.keys(rec0).slice(0, 40); out.sample = JSON.stringify(rec0).slice(0, 900); out.meta = JSON.stringify(one.j.meta).slice(0, 150);
return fin({ out });
