await page.goto(H + '/', { waitUntil: 'domcontentloaded' }); await sleep(12000);
const t = (await text()).replace(/\s+/g, ' ');
return { url: page.url().replace(/[?#].*/, ''), signin: /password|sign in/i.test(t) && !!(await page.$('input[type=password]')), head: t.slice(0, 120).replace(/[\w.+-]+@[\w.-]+/g, '<mail>') };
