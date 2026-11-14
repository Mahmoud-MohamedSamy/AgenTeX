const P = '7a1df4f2-8db3-471a-84ee-6cf889b5db04';
const up = await api('PATCH', '/modules/' + PM + '/records/' + P, { data: [{ field: 'product_code', value: sv('QA-GL-W5-C') }] }); out.cPatch = up.s + ' ' + up.t.slice(0, 200);
const dl = await api('DELETE', '/modules/' + PM + '/records/' + P); out.cDelete = dl.s + ' ' + dl.t.slice(0, 200);
return fin({ out });
