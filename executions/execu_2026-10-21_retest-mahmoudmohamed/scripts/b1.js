const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await go('/modules/' + D, 9000);
const t0 = (await txt()).split('Meetings')[1]?.slice(0, 800);
await page.getByRole('button', { name: /create deal|new deal|^create$/i }).first().click().catch(e => 'noclick');
await sleep(5000);
return done({ url: page.url(), t0, form: (await txt()).slice(-2500), shot: await shot('b1-createform') });
