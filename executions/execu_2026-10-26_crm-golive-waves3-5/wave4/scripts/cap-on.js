page.__cap = page.__cap || [];
if (!page.__capOn) { page.__capOn = 1;
  page.on('requestfinished', async rq => { const u = rq.url(); if (!u.includes('/api/v1/') || rq.method() === 'GET') return;
    const r = await rq.response().catch(() => null); let body = ''; try { body = r ? (await r.text()).slice(0, 1500) : ''; } catch (e) {}
    page.__cap.push({ m: rq.method(), u: u.replace(/^.*\/api\/v1/, ''), s: r && r.status(), req: (rq.postData() || '').slice(0, 4000), res: body }); }); }
return { on: page.__capOn, n: page.__cap.length };
