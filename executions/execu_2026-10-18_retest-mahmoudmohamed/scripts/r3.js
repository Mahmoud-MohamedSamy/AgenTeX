const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const one = await api('GET', '/modules/' + L + '/records/66642ace-4d74-4742-863a-56b2a8f887a0');
const d = (one.j && one.j.data && one.j.data.data) || [];
const rv = d.filter(f => /review/i.test(f.field)).map(f => f.field + '=' + JSON.stringify(f.value.value === undefined ? null : f.value.value));
const keys = Object.keys((one.j && one.j.data) || {}).filter(k => /review|status/i.test(k));
return done({ reviewFields: rv, topKeys: keys, topVals: keys.map(k => k + '=' + JSON.stringify(one.j.data[k]).slice(0, 120)), hasReviewStatusWord: /review_status/.test(one.t) });
