const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', C = '6f553963-01d6-4b68-9fb3-143d23044c41';
const g = async (m, id) => (await api('GET', `/modules/${m}/records/${id}`)).j?.data;
const q1 = await g(L, '5e72c952-1e60-403a-8999-0603fc3acff2'); const q2 = await g(L, 'ff1b0fa0-c440-4de0-9420-0c965e3b2e47');
const pick = r => Object.fromEntries((r?.data || []).filter(d => /lookup/.test(d.field)).map(d => [d.field, JSON.stringify(d.value)]));
const nm = r => Object.fromEntries((r?.data || []).filter(d => /name/.test(d.field)).map(d => [d.field, d.value?.value]));
return done({ q1: pick(q1), q2: pick(q2), X: nm(await g(C, 'f7b82386-15d7-4950-9d45-05e9dca09e43')), Y: nm(await g(C, '25b10f22-8ec2-4391-a6d8-9ff9770e8a80')) });
