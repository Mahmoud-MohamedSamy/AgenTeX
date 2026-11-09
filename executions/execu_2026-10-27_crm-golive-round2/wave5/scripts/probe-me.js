const r = await call('GET', '/iam/me/profile');
await page.goto(H + '/home', { waitUntil: 'domcontentloaded' }); await sleep(5000);
return { me: r.s, email: r.j && (r.j.email || (r.j.data && r.j.data.email)), profile: r.j && (r.j.profile_name || (r.j.data && r.j.data.profile_name)), url: page.url() };
