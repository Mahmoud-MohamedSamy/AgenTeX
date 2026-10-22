const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const out = {};
for (const id of ['0cee82f1-55ba-43b4-a54e-1f512709896a', '9802a2ed-fcf5-4539-8869-1b7d0e254027', '85e8a4fc-0b1d-4070-b772-17dd703fd6d3', '2e3666fe-3f70-427a-b2d8-0a4cee463a8c']) { const d = (await api('GET', `/modules/${L}/records/${id}`)).j.data; out[(d.data.find(x => x.field === 'name') || {}).value?.value] = d.data.filter(x => /multi|single_line/.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value)); }
return done(out);
