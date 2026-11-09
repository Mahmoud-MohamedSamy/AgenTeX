await page.goto(H + '/views/all/tickets/e12a0baa-459b-48fa-b5c8-bcaad81a5621', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
let t = ''; for (let i = 0; i < 120; i++) { await sleep(2000); t = await txt().catch(() => ''); if (/QA NDC smoke MI layout given/.test(t) || /\/login/.test(page.url())) break; }
return JSON.stringify({ url: page.url(), ok: /QA NDC smoke MI layout given/.test(t), head: t.replace(/\s+/g, ' ').slice(0, 300) });
