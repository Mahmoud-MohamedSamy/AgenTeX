const f = arr((await api('GET', '/web-forms?app=desk')).j).find(x => x.name === 'Customer Support Webform');
log({ embed_key: f.embed_key ? f.embed_key.slice(0, 6) + '…' : null, snippets: JSON.stringify(f.snippets).replace(/[A-Za-z0-9_-]{24,}/g, '<key>').slice(0, 1500) });
