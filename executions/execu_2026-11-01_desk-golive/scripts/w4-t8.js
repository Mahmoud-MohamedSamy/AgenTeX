const F = '5c2d51b3-8a21-4f10-9dd4-cf0015925bc9';
const f = D((await api('GET', '/desk/email-templates/folders')).j).folders.find(x => x.id === F);
out.folder = f;
let r = await api('PUT', '/desk/email-templates/folders/' + F, { ...f, visibility: 'bogus' }); out.bogus = r.s + ' ' + r.t.slice(0, 400);
r = await api('PUT', '/desk/email-templates/folders/' + F, { ...f, visibility: 'only_me' }); out.onlyme = r.s + ' ' + r.t.slice(0, 300);
return fin({ out });
