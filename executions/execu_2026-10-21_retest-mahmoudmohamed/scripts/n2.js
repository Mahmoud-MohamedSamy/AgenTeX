const lab = page.getByText('Phone Permission', { exact: true }).first();
await lab.hover(); await sleep(600);
const near = await lab.evaluate(e => { let p = e; for (let i = 0; i < 5; i++) { p = p.parentElement; if (p.querySelectorAll('button').length) break; } return [...p.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.title || b.innerText || '').slice(0, 40)); });
return done({ near });
