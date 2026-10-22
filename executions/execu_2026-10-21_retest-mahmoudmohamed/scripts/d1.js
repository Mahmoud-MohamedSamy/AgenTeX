const resp = []; const f = async r => { const u = r.url(); if (u.includes('/api/') && !/auth|notif|hubs/.test(u)) resp.push(r.request().method() + ' ' + u.replace(H + '/api/v1', '').slice(0, 150) + ' ' + r.status()); }; page.on('response', f);
const errs = []; const fe = m => { if (m.type() === 'error') errs.push(m.text().slice(0, 300)); }; page.on('console', fe);
await go('/settings/pipelines', 20000);
page.off('response', f); page.off('console', fe);
return done({ body: (await txt()).split('Storage Requests')[1]?.slice(0, 1500), resp: resp.filter(x => !/iam\/me|teamspaces|resolved|telephony|mail|apps|settings\/hub/.test(x)), errs, shot: await shot('d1-pipelines') });
