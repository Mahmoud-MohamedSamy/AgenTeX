out.me = (await api('GET', '/iam/me')).j?.data?.displayName || '?';
out.list = await listQA(); out.open = {};
for (const k of Object.keys(TK)) out.open[k] = st(await probe(k, k === 'MK1' || k === 'CSD'));
return fin({ out });
