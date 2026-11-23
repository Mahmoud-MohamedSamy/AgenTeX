const me = (await api('GET', '/iam/me')).j?.data || {}; const em = me.email || me.user?.email; log('owner email found', !!em);
const id = fs.readFileSync(RUN + '/out/h1-url.txt', 'utf8').trim().split('/').pop();
const p = await api('PATCH', `/modules/${made.mod}/records/${id}`, { data: data({ qa_email: em }) }); log('set qa_email', E(p));
