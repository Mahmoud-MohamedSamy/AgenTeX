for (const p of ['/modules/' + TM + '/drafts', '/modules/' + TM + '/drafts/mine']) { const r = await api('GET', p); out[p.slice(-12)] = r.s + ' ' + r.t.slice(0, 250); }
return fin({ out });
